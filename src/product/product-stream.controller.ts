import {
  Controller,
  Get,
  Sse,
  MessageEvent,
  Res,
} from '@nestjs/common';
import { interval, Observable, from, map, switchMap } from 'rxjs';
import { ProductHistoryRepository } from './repositories/product-history.repository';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller('stream')
export class ProductStreamController {
  constructor(private readonly historyRepo: ProductHistoryRepository) {}

  private readonly POLL_INTERVAL_MS = parseInt(process.env.STREAM_POLL_INTERVAL || '5000', 10);
  private readonly WINDOW_MS = parseInt(process.env.STREAM_WINDOW_MS || '10000', 10);

  @Sse('changes')
  streamChanges(): Observable<MessageEvent> {
    return interval(this.POLL_INTERVAL_MS).pipe(
      switchMap(() => {
        const since = new Date(Date.now() - this.WINDOW_MS);
        return from(
          this.historyRepo.getChangedProducts({
            since: since.toISOString(),
            page: 1,
            limit: 10,
          })
        );
      }),
      map((result) => ({ data: result }))
    );
  }


  @Get('dashboard')
  serveHtml(@Res() res: Response) {
    const htmlPath = join(process.cwd(), 'public/index.html');
    const html = readFileSync(htmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}