import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { AddItemDto } from './dto/add-item.dto';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async getContracts() {
    return this.prisma.rentalContract.findMany({
      include: {
        items: { include: { inventory: { include: { type: true } } } },
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createContract(dto: CreateContractDto) {
    // Упрощённо: ищем или создаём клиента по имени
    let customer = await this.prisma.customer.findFirst({ where: { name: dto.customerName } });
    if (!customer) {
      customer = await this.prisma.customer.create({ data: { name: dto.customerName, phone: '' } });
    }

    return this.prisma.rentalContract.create({
      data: {
        number: `RENT-${Date.now().toString().slice(-6)}`,
        customerId: customer.id,
        employeeId: 1, // TODO: брать из JWT токена
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        status: 'active'
      }
    });
  }

  async addContractItem(dto: AddItemDto) {
    const inv = await this.prisma.inventory.findUnique({ where: { id: dto.inventoryId } });
    if (!inv) throw new NotFoundException('Инвентарь не найден');
    if (inv.status !== 'available') throw new BadRequestException('Инвентарь недоступен для аренды');

    await this.prisma.rentalContractItem.create({ data: dto });

    // Меняем статус и логируем движение
    await this.prisma.inventory.update({ where: { id: dto.inventoryId }, data: { status: 'rented' } });
    await this.prisma.inventoryMovement.create({
      data: {
        inventoryId: dto.inventoryId,
        employeeId: 1, // TODO: из токена
        type: 'rental',
        quantity: 1,
        note: `Выдача по договору #${dto.contractId}`
      }
    });

    return { success: true };
  }

  async completeContract(id: number) {
    const contract = await this.prisma.rentalContract.findUnique({
      where: { id },
      include: { items: true }
    });
    if (!contract) throw new NotFoundException('Договор не найден');
    if (contract.status === 'completed') throw new BadRequestException('Договор уже завершён');

    // Возвращаем инвентарь
    for (const item of contract.items) {
      await this.prisma.inventory.update({ where: { id: item.inventoryId }, data: { status: 'available' } });
      await this.prisma.inventoryMovement.create({
        data: {
          inventoryId: item.inventoryId,
          employeeId: 1,
          type: 'return',
          quantity: 1,
          note: `Возврат по договору #${id}`
        }
      });
    }

    return this.prisma.rentalContract.update({ where: { id }, data: { status: 'completed' } });
  }
}