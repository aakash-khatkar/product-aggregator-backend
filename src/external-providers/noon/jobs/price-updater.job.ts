import { Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { NoonService } from '../noon.service';

@Injectable()
export class PriceUpdaterJob implements OnModuleInit {
  constructor(private readonly noonService: NoonService) {}

  onModuleInit() {
    this.noonService.updatePrices();
  }

  @Interval(5000)
  handleInterval() {
    this.noonService.updatePrices();
  }
}