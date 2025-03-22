import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProviderService {
  private readonly defaultInterval: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.defaultInterval = Number(
      this.configService.getOrThrow('DEFAULT_FETCH_INTERVAL_MS'),
    );
  }

  async getProvidersDueForFetch(): Promise<any[]> {
    const now = Date.now();

    const providers = await this.prisma.provider.findMany({
      where: { isActive: true },
    });

    return providers.filter((provider) => {
      const interval = provider.fetchIntervalMs ?? this.defaultInterval;
      if (!provider.lastFetchedAt) return true;

      const lastFetchedTime = new Date(provider.lastFetchedAt).getTime();
      return now - lastFetchedTime >= interval;
    });
  }

  async updateLastFetchedAt(providerId: string): Promise<void> {
    await this.prisma.provider.update({
      where: { id: providerId },
      data: { lastFetchedAt: new Date() },
    });
  }
}