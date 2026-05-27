import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryTypeDto } from './dto/create-inventory-type.dto';
import { UpdateInventoryTypeDto } from './dto/update-inventory-type.dto';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) { }

  // === Inventory Types ===
  async getInventoryTypes() { return this.prisma.inventoryType.findMany({ orderBy: { name: 'asc' } }); }
  async createInventoryType(dto: CreateInventoryTypeDto) {
    return this.prisma.inventoryType.create({ data: { name: dto.name } }); // ← ЯВНОЕ УКАЗАНИЕ ПОЛЯ
  }
  async updateInventoryType(id: number, dto: UpdateInventoryTypeDto) {
    return this.prisma.inventoryType.update({ where: { id }, data: { name: dto.name } });
  }
  async deleteInventoryType(id: number) { return this.prisma.inventoryType.delete({ where: { id } }); }

  // === Zones ===
  async getZones() { return this.prisma.zone.findMany({ orderBy: { name: 'asc' } }); }
  async createZone(data: { name: string }) { return this.prisma.zone.create({ data }); }
  async updateZone(id: number, data: { name: string }) { return this.prisma.zone.update({ where: { id }, data }); }
  async deleteZone(id: number) { return this.prisma.zone.delete({ where: { id } }); }

  // 🔹 НОВОЕ: Cells
  async getCells() {
    return this.prisma.cell.findMany({ include: { zone: { select: { id: true, name: true } } }, orderBy: { name: 'asc' } });
  }
  async createCell(data: { name: string; zoneId: number }) { return this.prisma.cell.create({ data }); }
  async updateCell(id: number, data: { name?: string; zoneId?: number }) { return this.prisma.cell.update({ where: { id }, data }); }
  async deleteCell(id: number) { return this.prisma.cell.delete({ where: { id } }); }

  // 🔹 НОВОЕ: Inventory
  async getInventory() {
    return this.prisma.inventory.findMany({
      include: {
        type: { select: { id: true, name: true } },
        cell: { select: { id: true, name: true, zone: { select: { name: true } } } },
      },
      orderBy: { name: 'asc' },
    });
  }
  async createInventory(data: { name: string; typeId: number; cellId: number; status?: string }) {
    return this.prisma.inventory.create({ data: { ...data, status: data.status || 'available' } });
  }
  async updateInventory(id: number, data: { name?: string; typeId?: number; cellId?: number; status?: string }) {
    return this.prisma.inventory.update({ where: { id }, data });
  }
  async deleteInventory(id: number) { return this.prisma.inventory.delete({ where: { id } }); }
  async getSuppliers() {
    return this.prisma.supplier.findMany({ orderBy: { name: 'asc' } });
  }

  async createSupplier(data: { name: string }) {
    return this.prisma.supplier.create({ data });
  }

  async updateSupplier(id: number, data: { name: string }) {
    return this.prisma.supplier.update({ where: { id }, data });
  }

  async deleteSupplier(id: number) {
    return this.prisma.supplier.delete({ where: { id } });
  }
}