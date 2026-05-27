import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateInventoryTypeDto } from './dto/update-inventory-type.dto';

@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name); // ← ЛОГГИРОВАНИЕ
  constructor(private readonly catalogService: CatalogService) { }

  // Inventory Types
  @Get('inventory-types') getInventoryTypes() { return this.catalogService.getInventoryTypes(); }
  @Post('inventory-types') createInventoryType(@Body() dto: CreateInventoryTypeDto) {
    this.logger.log(`[CREATE] Тип: ${JSON.stringify(dto)}`); // ← ЛОГ
    return this.catalogService.createInventoryType(dto);
  }
  @Patch('inventory-types/:id') updateInventoryType(@Param('id') id: string, @Body() dto: UpdateInventoryTypeDto) { return this.catalogService.updateInventoryType(+id, dto); }
  @Delete('inventory-types/:id') deleteInventoryType(@Param('id') id: string) { return this.catalogService.deleteInventoryType(+id); }

  // Zones
  @Get('zones') getZones() { return this.catalogService.getZones(); }
  @Post('zones') createZone(@Body() data: { name: string }) { return this.catalogService.createZone(data); }
  @Patch('zones/:id') updateZone(@Param('id') id: string, @Body() data: { name: string }) { return this.catalogService.updateZone(+id, data); }
  @Delete('zones/:id') deleteZone(@Param('id') id: string) { return this.catalogService.deleteZone(+id); }

  // 🔹 НОВОЕ: Cells
  @Get('cells') getCells() { return this.catalogService.getCells(); }
  @Post('cells') createCell(@Body() data: { name: string; zoneId: number }) { return this.catalogService.createCell(data); }
  @Patch('cells/:id') updateCell(@Param('id') id: string, @Body() data: { name?: string; zoneId?: number }) { return this.catalogService.updateCell(+id, data); }
  @Delete('cells/:id') deleteCell(@Param('id') id: string) { return this.catalogService.deleteCell(+id); }

  // 🔹 НОВОЕ: Inventory
  @Get('inventory') getInventory() { return this.catalogService.getInventory(); }
  @Post('inventory') createInventory(@Body() data: { name: string; typeId: number; cellId: number; status?: string }) {
    this.logger.log(`[CREATE] Инвентарь: ${JSON.stringify(data)}`); // ← ЛОГ
    return this.catalogService.createInventory(data);
  }
  @Patch('inventory/:id') updateInventory(@Param('id') id: string, @Body() data: { name?: string; typeId?: number; cellId?: number; status?: string }) { return this.catalogService.updateInventory(+id, data); }
  @Delete('inventory/:id') deleteInventory(@Param('id') id: string) { return this.catalogService.deleteInventory(+id); }

  // === SUPPLIERS (вставь в конец класса CatalogController) ===
  @Get('suppliers')
  getSuppliers() { return this.catalogService.getSuppliers(); }

  @Post('suppliers')
  createSupplier(@Body() data: { name: string }) {
    this.logger.log(`[SUPPLIER] Создан: ${JSON.stringify(data)}`);
    return this.catalogService.createSupplier(data);
  }

  @Patch('suppliers/:id')
  updateSupplier(@Param('id') id: string, @Body() data: { name: string }) {
    return this.catalogService.updateSupplier(+id, data);
  }

  @Delete('suppliers/:id')
  deleteSupplier(@Param('id') id: string) {
    return this.catalogService.deleteSupplier(+id);
  }
}