import { Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { AmazonService } from '../amazon.service';

@Injectable()
export class PriceUpdaterJob implements OnModuleInit {
  constructor(private readonly amazonService: AmazonService) {}

  onModuleInit() {
    this.amazonService.updatePrices();
  }

  @Interval(5000)
  handleInterval() {
    this.amazonService.updatePrices();
  }
}