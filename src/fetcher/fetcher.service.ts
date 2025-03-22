import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { retry, timeout, catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import { QueueProducerService } from 'src/queue/queue-producer.service';

@Injectable()
export class FetcherService {
  private readonly logger = new Logger(FetcherService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly queueProducer: QueueProducerService,
  ) {}

  async fetchAndProcessProvider(provider: {
    id: string;
    name: string;
    baseUrl: string;
    maxRetries: number;
  }): Promise<void> {
    const { name, baseUrl, maxRetries } = provider;

    this.logger.log(`[${name}] Fetching from ${baseUrl} with up to ${maxRetries} retries...`);

    try {
      const response = await firstValueFrom(
        this.httpService.get(baseUrl).pipe(
          timeout(5000),
          retry({
            count: maxRetries,
            delay: 1000,
            resetOnSuccess: true,
          }),
          catchError((error: AxiosError) => {
            this.logger.error(`[${name}] All retry attempts failed: ${error.message}`);
            throw error;
          }),
        ),
      );

      const rawData = response.data;

      if (!Array.isArray(rawData)) {
        throw new Error(`[${name}] Invalid response format — expected array`);
      }

      await this.queueProducer.publishRawProductData(name, rawData);
    } catch (error) {
      this.logger.error(`[${name}] Final failure: ${error.message}`);
      throw error;
    }
  }
}