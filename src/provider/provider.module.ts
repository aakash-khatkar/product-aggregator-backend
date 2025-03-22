import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { ProviderService } from './provider.service';

@Module({
  imports: [PrismaModule],
  providers: [ProviderService],
  exports: [ProviderService],
})
export class ProviderModule {}