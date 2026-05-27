import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { AddItemDto } from './dto/add-item.dto';

@Controller('rental')
export class RentalController {
  private readonly logger = new Logger(RentalController.name);
  constructor(private readonly service: RentalService) {}

  @Get()
  getContracts() { return this.service.getContracts(); }

  @Post()
  createContract(@Body() dto: CreateContractDto) {
    this.logger.log(`[CONTRACT] Создан: ${JSON.stringify(dto)}`);
    return this.service.createContract(dto);
  }

  @Post('items')
  addItem(@Body() dto: AddItemDto) {
    this.logger.log(`[ITEM] Добавлен в договор #${dto.contractId}: inv#${dto.inventoryId}`);
    return this.service.addContractItem(dto);
  }

  @Post('complete/:id')
  completeContract(@Param('id') id: string) {
    this.logger.log(`[COMPLETE] Завершение договора #${id}`);
    return this.service.completeContract(+id);
  }
}