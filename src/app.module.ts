import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoonModule } from './external-providers/noon/noon.module';
import { NoonController } from './external-providers/noon/noon.controller';
import { NoonService } from './external-providers/noon/noon.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    NoonModule,
  ],
  controllers: [AppController, NoonController],
  providers: [AppService, NoonService],
})
export class AppModule {}
