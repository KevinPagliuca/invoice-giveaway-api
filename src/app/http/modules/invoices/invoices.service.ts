import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { GiveawayStatusEnum } from 'app/shared/giveaway-status';
import { InvoiceGiveawayStatusEnum } from 'app/shared/invoice-giveaway-status';
import { PrismaService } from 'database/prisma/prisma.service';
import { generateRandomId } from 'utils/generate-id';
import { CreateInvoiceDTO } from './interfaces/create';
import { UpdateInvoiceDTO } from './interfaces/update';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly giveawayInclude = {
    giveaway: {
      select: {
        endDate: true,
        startDate: true,
        id: true,
        reference: true,
        status: true,
      },
    },
  };

  async getAll() {
    const invoices = await this.prisma.invoice.findMany({ include: this.giveawayInclude });
    return invoices;
  }

  async getById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: this.giveawayInclude,
    });
    return invoice;
  }

  async getByUserId(userId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { userId },
      include: this.giveawayInclude,
    });
    return invoices;
  }

  async create(body: CreateInvoiceDTO, userId: string) {
    const isAlreadyRegistered = await this.prisma.invoice.findFirst({
      where: { number: body.number, cnpj: body.cnpj },
    });
    if (isAlreadyRegistered) throw new UnauthorizedException('Nota Fiscal já cadastrada');

    const activeGiveaway = await this.prisma.giveaway.findFirst({
      where: { status: GiveawayStatusEnum.IN_PROGRESS },
    });

    let luckyCode = generateRandomId();
    const MAX_TRIES = 5;

    for (let i = 0; i < MAX_TRIES; i++) {
      const isLuckyCodeAlreadyRegistered = await this.prisma.invoice.findFirst({
        where: { luckyCode },
      });

      if (isLuckyCodeAlreadyRegistered) luckyCode = generateRandomId();
      else break;
    }

    const status = activeGiveaway
      ? InvoiceGiveawayStatusEnum.PENDING
      : InvoiceGiveawayStatusEnum.WAITING;
    const date = body.date && new Date(body.date);
    const invoice = await this.prisma.invoice.create({
      data: {
        ...body,
        date,
        userId,
        status,
        luckyCode,
        giveawayId: activeGiveaway?.id,
        totalValue: Number(body.totalValue),
      },
      include: this.giveawayInclude,
    });
    return invoice;
  }

  async update(id: string, body: UpdateInvoiceDTO) {
    const invoice = await this.getById(id);

    if (!invoice) throw new NotFoundException('Nota Fiscal não encontrada');

    const date = body.date ? new Date(body.date) : invoice.date;
    const totalValue = body.totalValue ? Number(body.totalValue) : invoice.totalValue;

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        ...body,
        date,
        totalValue,
      },
      include: this.giveawayInclude,
    });
    return updatedInvoice;
  }

  async delete(id: string) {
    const invoice = await this.getById(id);
    if (!invoice) throw new NotFoundException('Nota Fiscal não encontrada');

    await this.prisma.invoice.delete({ where: { id: invoice.id } });
    return { message: 'Nota Fiscal deletada com sucesso' };
  }
}
