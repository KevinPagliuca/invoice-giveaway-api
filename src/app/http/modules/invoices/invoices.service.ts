import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'database/prisma/prisma.service';
import { CreateInvoiceDTO } from './interfaces/create';
import { UpdateInvoiceDTO } from './interfaces/update';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const invoices = await this.prisma.invoice.findMany();
    return invoices;
  }

  async getById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });
    return invoice;
  }

  async create(body: CreateInvoiceDTO, userId: string) {
    const isAlreadyRegistered = await this.prisma.invoice.findFirst({
      where: { number: body.number, cnpj: body.cnpj },
    });

    if (isAlreadyRegistered) throw new NotFoundException('Nota Fiscal já cadastrada');

    const date = body.date && new Date(body.date);
    const invoice = await this.prisma.invoice.create({
      data: {
        ...body,
        date,
        userId,
      },
    });
    return invoice;
  }

  async update(id: string, body: UpdateInvoiceDTO) {
    const invoice = await this.getById(id);

    if (!invoice) throw new NotFoundException('Nota Fiscal não encontrada');
    const invoiceDate = body.date ? new Date(body.date) : invoice.date;

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        ...body,
        date: invoiceDate,
      },
    });
    return updatedInvoice;
  }

  async delete(id: string) {
    const invoice = await this.getById(id);

    if (!invoice) throw new NotFoundException('Nota Fiscal não encontrada');

    await this.prisma.invoice.delete({
      where: { id: invoice.id },
    });
    return { message: 'Nota Fiscal deletada com sucesso' };
  }

  async getByUserId(userId: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: { userId },
    });
    return invoices;
  }
}
