import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { CreateReceiptItemDto } from './dto/create-receipt-item.dto';

@Injectable()
export class ReceivingService {
  constructor(private prisma: PrismaService) { }

  // === RECEIPTS ===
  async getReceipts() {
    return this.prisma.receipt.findMany({
      include: { supplier: true, items: { include: { type: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createReceipt(dto: CreateReceiptDto) {
    return this.prisma.receipt.create({
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : new Date(),
        number: `RCV-${Date.now()}` // простой уникальный номер
      }
    });
  }

  async getReceiptById(id: number) {
    const receipt = await this.prisma.receipt.findUnique({
      where: { id },
      include: { items: { include: { type: true } }, supplier: true }
    });
    if (!receipt) throw new NotFoundException(`Накладная #${id} не найдена`);
    return receipt;
  }

  // === RECEIPT ITEMS ===
  async addReceiptItem(dto: CreateReceiptItemDto) {
    // 1. Создаём запись в позиции прихода
    const item = await this.prisma.receiptItem.create({ data: dto });

    // 2. Автоматически создаём экземпляры Inventory в ячейке по умолчанию (или первой доступной)
    // Для упрощения: берём первую ячейку из первой зоны
    const defaultCell = await this.prisma.cell.findFirst({ orderBy: { id: 'asc' } });
    if (!defaultCell) throw new NotFoundException('Нет доступных ячеек для размещения');

    // Создаём нужное количество экземпляров инвентаря
    const inventories = [];
    for (let i = 0; i < dto.quantity; i++) {
      const inv = await this.prisma.inventory.create({
        data: {
          name: `Снасть #${Date.now()}-${i}`,           
          serial_number: `SN-${Date.now()}-${i}`,      
          typeId: dto.typeId,
          cellId: defaultCell.id,
          status: 'available',
          condition: 'new',                              
        }
      });
      inventories.push(inv);

      // 3. Фиксируем движение инвентаря (приход)
      await this.prisma.inventoryMovement.create({
        data: {
          inventoryId: inv.id,
          employeeId: 1, // заглушка: первый сотрудник (в реальности — из токена)
          type: 'receipt',
          quantity: 1,
          note: `Приход по накладной #${dto.receiptId}`
        }
      });
    }

    return { item, inventories };
  }

  async deleteReceipt(id: number) {
    // Сначала удаляем позиции, потом накладную (каскад можно настроить в Prisma)
    await this.prisma.receiptItem.deleteMany({ where: { receiptId: id } });
    return this.prisma.receipt.delete({ where: { id } });
  }
}