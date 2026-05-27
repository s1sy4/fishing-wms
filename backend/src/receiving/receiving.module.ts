import { Module } from '@nestjs/common';
import { ReceivingController } from './receiving.controller';
import { ReceivingService } from './recieving.service';

@Module({
  controllers: [ReceivingController],
  providers: [ReceivingService],
  exports: [ReceivingService]
})
export class ReceivingModule {}