import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateInventoryTypeDto} from './dto/create-inventory-type.dto';
import { UpdateInventoryTypeDto} from './dto/update-inventory-type.dto'
import { CreateZoneDto } from './dto/create-zone.dto';
import {UpdateZoneDto } from './dto/update-zone.dto';
import { CreateCellDto } from './dto/create-cell.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto} from './dto/update-supplier.dto'
import { CreateInventoryDto} from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';  

@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);
  constructor(private readonly catalogService: CatalogService) {}

  // === INVENTORY TYPES ===
  @Get('inventory-types') getInventoryTypes() { return this.catalogService.getInventoryTypes(); }
  @Post('inventory-types') createInventoryType(@Body() dto: CreateInventoryTypeDto) { return this.catalogService.createInventoryType(dto); }
  @Patch('inventory-types/:id') updateInventoryType(@Param('id') id: string, @Body() dto: UpdateInventoryTypeDto) { return this.catalogService.updateInventoryType(+id, dto); }
  @Delete('inventory-types/:id') deleteInventoryType(@Param('id') id: string) { return this.catalogService.deleteInventoryType(+id); }

  // === ZONES ===
  @Get('zones') getZones() { return this.catalogService.getZones(); }
  @Post('zones') createZone(@Body() dto: CreateZoneDto) { return this.catalogService.createZone(dto); }
  @Patch('zones/:id') updateZone(@Param('id') id: string, @Body() dto: UpdateZoneDto) { return this.catalogService.updateZone(+id, dto); }
  @Delete('zones/:id') deleteZone(@Param('id') id: string) { return this.catalogService.deleteZone(+id); }

  // === CELLS ===
  @Get('cells') getCells() { return this.catalogService.getCells(); }
  @Post('cells') createCell(@Body() dto: CreateCellDto) { return this.catalogService.createCell(dto); }
  @Patch('cells/:id') updateCell(@Param('id') id: string, @Body() dto: UpdateCellDto) { return this.catalogService.updateCell(+id, dto); }
  @Delete('cells/:id') deleteCell(@Param('id') id: string) { return this.catalogService.deleteCell(+id); }

  // === SUPPLIERS ===
  @Get('suppliers') getSuppliers() { return this.catalogService.getSuppliers(); }
  @Post('suppliers') createSupplier(@Body() dto: CreateSupplierDto) { return this.catalogService.createSupplier(dto); }
  @Patch('suppliers/:id') updateSupplier(@Param('id') id: string, @Body() dto: UpdateSupplierDto) { return this.catalogService.updateSupplier(+id, dto); }
  @Delete('suppliers/:id') deleteSupplier(@Param('id') id: string) { return this.catalogService.deleteSupplier(+id); }

  // === INVENTORY ===
  @Get('inventory') getInventory() { return this.catalogService.getInventory(); }
  @Post('inventory') createInventory(@Body() dto: CreateInventoryDto) {
    this.logger.log(`[INVENTORY] Создан: ${dto.serial_number}`);
    return this.catalogService.createInventory(dto);
  }
  @Patch('inventory/:id') updateInventory(@Param('id') id: string, @Body() dto: UpdateInventoryDto) { return this.catalogService.updateInventory(+id, dto); }
  @Delete('inventory/:id') deleteInventory(@Param('id') id: string) { return this.catalogService.deleteInventory(+id); }
}