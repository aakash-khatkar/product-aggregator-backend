import { Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CareemService } from '../careem.service';

@Injectable()
export class PriceUpdaterJob implements OnModuleInit {
  constructor(private readonly careemService: CareemService) {}

  onModuleInit() {
    this.careemService.updatePrices();
  }

  @Interval(5000)
  handleInterval() {
    this.careemService.updatePrices();
  }
}