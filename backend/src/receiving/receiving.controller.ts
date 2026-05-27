import { Controller, Get, Post, Body, Param, Delete, Logger } from '@nestjs/common';
import { ReceivingService } from './recieving.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';

@Controller('receiving')
export class ReceivingController {
  private readonly logger = new Logger(ReceivingController.name);

  constructor(private readonly service: ReceivingService) {}

  @Get()
  getReceipts() { return this.service.getReceipts(); }

  @Post()
  createReceipt(@Body() dto: CreateReceiptDto) {
    this.logger.log(`[RECEIPT] Создана накладная: ${JSON.stringify(dto)}`);
    return this.service.createReceipt(dto);
  }

  @Get(':id')
  getReceipt(@Param('id') id: string) { return this.service.getReceiptById(+id); }

  @Post('items')
  addReceiptItem(@Body() dto: CreateReceiptItemDto) {
    this.logger.log(`[RECEIPT ITEM] Добавлена позиция: ${JSON.stringify(dto)}`);
    return this.service.addReceiptItem(dto);
  }

  @Delete(':id')
  deleteReceipt(@Param('id') id: string) { return this.service.deleteReceipt(+id); }
}