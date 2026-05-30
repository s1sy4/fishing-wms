import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  // === INVENTORY TYPES ===
  async getInventoryTypes() { return this.prisma.inventoryType.findMany({ orderBy: { name: 'asc' } }); }
  async createInventoryType(dto: CreateInventoryTypeDto) { return this.prisma.inventoryType.create({ data: dto }); }
  async updateInventoryType(id: number, dto: UpdateInventoryTypeDto) { return this.prisma.inventoryType.update({ where: { id }, data: dto }); }
  async deleteInventoryType(id: number) { return this.prisma.inventoryType.delete({ where: { id } }); }

  // === ZONES ===
  async getZones() { return this.prisma.zone.findMany({ orderBy: { name: 'asc' } }); }
  async createZone(dto: CreateZoneDto) { return this.prisma.zone.create({ data: dto }); }
  async updateZone(id: number, dto: UpdateZoneDto) { return this.prisma.zone.update({ where: { id }, data: dto }); }
  async deleteZone(id: number) { return this.prisma.zone.delete({ where: { id } }); }

  // === CELLS ===
  async getCells() { return this.prisma.cell.findMany({ include: { zone: true }, orderBy: { name: 'asc' } }); }
  async createCell(dto: CreateCellDto) { return this.prisma.cell.create({ data: { ...dto, status: dto.status || 'available', capacity: dto.capacity || 1 } }); }
  async updateCell(id: number, dto: UpdateCellDto) { return this.prisma.cell.update({ where: { id }, data: dto }); }
  async deleteCell(id: number) { return this.prisma.cell.delete({ where: { id } }); }

  // === SUPPLIERS ===
  async getSuppliers() { return this.prisma.supplier.findMany({ orderBy: { name: 'asc' } }); }
  async createSupplier(dto: CreateSupplierDto) { return this.prisma.supplier.create({ data: dto }); }
  async updateSupplier(id: number, dto: UpdateSupplierDto) { return this.prisma.supplier.update({ where: { id }, data: dto }); }
  async deleteSupplier(id: number) { return this.prisma.supplier.delete({ where: { id } }); }

  // === INVENTORY ===
  async getInventory() {
    return this.prisma.inventory.findMany({
      include: { type: true, cell: { include: { zone: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async createInventory(dto: CreateInventoryDto) {
    return this.prisma.inventory.create({
      data: {
        name: dto.name,
        serial_number: dto.serial_number,
        typeId: dto.typeId,
        cellId: dto.cellId,
        status: dto.status || 'available',
        condition: dto.condition || 'new',
        purchase_date: dto.purchase_date ? new Date(dto.purchase_date) : undefined,
        purchase_price: dto.purchase_price || 0,
      }
    });
  }

  async updateInventory(id: number, dto: UpdateInventoryDto) {
    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.serial_number !== undefined) data.serial_number = dto.serial_number;
    if (dto.typeId !== undefined) data.typeId = dto.typeId;
    if (dto.cellId !== undefined) data.cellId = dto.cellId;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.condition !== undefined) data.condition = dto.condition;
    if (dto.purchase_date !== undefined) data.purchase_date = new Date(dto.purchase_date);
    if (dto.purchase_price !== undefined) data.purchase_price = dto.purchase_price;

    return this.prisma.inventory.update({ where: { id }, data });
  }

  async deleteInventory(id: number) { return this.prisma.inventory.delete({ where: { id } }); }
}