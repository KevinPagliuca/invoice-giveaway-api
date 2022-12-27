import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GiveawayStatusEnum } from 'app/shared/giveaway-status';
import { InvoiceGiveawayStatusEnum } from 'app/shared/invoice-giveaway-status';
import { DateRegex } from 'app/shared/validators';
import { PrismaService } from 'database/prisma/prisma.service';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { generateRandomId } from 'utils/generate-id';
import { CreateGiveawayDTO } from './interfaces/create';
import { UpdateGiveawayDTO } from './interfaces/update';

@Injectable()
export class GiveawayService {
  constructor(private readonly prisma: PrismaService) {}

  private formatDate(dateToFormat: string | Date, withTime: boolean) {
    if (typeof dateToFormat === 'string' && !DateRegex.test(dateToFormat)) {
      throw new BadRequestException('Formato de data inválida!');
    }

    const date = new Date(dateToFormat);
    date.setUTCHours(+9);

    if (withTime) return format(date, "dd/MM/yyyy 'às' HH'h'", { locale: ptBR });
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  }

  private setDateTO6AM(date: Date) {
    date.setUTCHours(6);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
  }

  private readonly giveawayWinnerIncludes = {
    winner: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  private async getParticipantsByGivewayId(giveawayId: string) {
    const participants = await this.prisma.invoice.count({
      where: { giveawayId },
    });

    return participants;
  }

  async getAll() {
    const giveaways = await this.prisma.giveaway.findMany({
      include: this.giveawayWinnerIncludes,
    });

    return giveaways;
  }

  async getGiveawayById(id: string) {
    const giveaway = await this.prisma.giveaway.findUnique({
      where: { id },
      include: this.giveawayWinnerIncludes,
    });
    return giveaway;
  }

  async getGiveawayByReference(reference: string) {
    const giveaway = await this.prisma.giveaway.findUnique({
      where: { reference },
      include: this.giveawayWinnerIncludes,
    });
    return giveaway;
  }

  async getActiveGiveaway(throwError?: boolean) {
    const giveaway = await this.prisma.giveaway.findFirst({
      where: { status: GiveawayStatusEnum.IN_PROGRESS },
      include: this.giveawayWinnerIncludes,
    });

    if (throwError && !giveaway) {
      throw new NotFoundException('Não existe nenhum sorteio em andamento!');
    }

    if (giveaway) {
      const participants = await this.getParticipantsByGivewayId(giveaway.id);
      return { ...giveaway, participants };
    } else return giveaway;
  }

  async create(body: CreateGiveawayDTO) {
    const activeGiveaway = await this.getActiveGiveaway();

    if (activeGiveaway) {
      const activeGiveawayEndDate = this.formatDate(activeGiveaway.endDate, true);
      throw new UnauthorizedException(
        `Já existe um sorteio em andamento, você poderá criar um novo sorteio a partir do dia ${activeGiveawayEndDate}`
      );
    }

    let referenceId = generateRandomId();
    const MAX_TRIES = 5;

    for (let i = 0; i < MAX_TRIES; i++) {
      if (i === MAX_TRIES - 1) {
        throw new InternalServerErrorException(
          'Ocorreu um erro ao tentarmos criar o sorteio, tente novamente mais tarde!'
        );
      }

      const giveaway = await this.getGiveawayByReference(referenceId);
      if (!giveaway) break;
      referenceId = generateRandomId();
    }

    try {
      const startDate = this.setDateTO6AM(new Date(body.startDate));
      const endDate = this.setDateTO6AM(new Date(body.endDate));
      const newGiveaway = await this.prisma.giveaway.create({
        data: {
          ...body,
          reference: referenceId,
          status: GiveawayStatusEnum.IN_PROGRESS,
          startDate,
          endDate,
        },
        include: this.giveawayWinnerIncludes,
      });
      await this.prisma.invoice.updateMany({
        where: { giveawayId: null, status: InvoiceGiveawayStatusEnum.WAITING },
        data: {
          giveawayId: newGiveaway.id,
          status: InvoiceGiveawayStatusEnum.PENDING,
        },
      });
      const participants = await this.getParticipantsByGivewayId(newGiveaway.id);

      return { ...newGiveaway, participants };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentarmos criar o sorteio, tente novamente mais tarde!'
      );
    }
  }

  async update(id: string, body: UpdateGiveawayDTO) {
    const giveawayById = await this.getGiveawayById(id);

    if (!giveawayById) throw new BadRequestException('Sorteio não encontrado!');

    if (!body.endDate) return giveawayById;

    try {
      const endDate = this.setDateTO6AM(new Date(body.endDate));

      const giveaway = await this.prisma.giveaway.update({
        where: { id },
        data: { endDate },
      });

      const participants = await this.getParticipantsByGivewayId(giveaway.id);
      return { ...giveaway, participants };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentarmos atualizar o sorteio, tente novamente mais tarde!'
      );
    }
  }

  async delete(id: string) {
    const giveawayById = await this.getGiveawayById(id);

    if (!giveawayById) throw new BadRequestException('Sorteio não encontrado!');

    await this.prisma.invoice.updateMany({
      where: { giveawayId: id },
      data: { giveawayId: null, status: InvoiceGiveawayStatusEnum.WAITING },
    });

    try {
      await this.prisma.giveaway.delete({ where: { id } });
      return { message: 'Sorteio deletado com sucesso!' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentarmos deletar o sorteio, tente novamente mais tarde!'
      );
    }
  }

  // @Cron('*/5 * * * * *') // every 5 seconds - for testing
  @Cron('0 6 * * *') // 06:00 AM - every day
  async sortGiveawayWinner() {
    const giveaway = await this.getActiveGiveaway();

    if (!giveaway) return { message: 'Nenhum sorteio em andamento!' };

    const today = new Date();
    const endDate = giveaway.endDate;

    if (today < endDate) return { message: 'Sorteio em andamento...' };

    const invoices = await this.prisma.invoice.findMany({
      where: { giveawayId: giveaway.id },
    });

    if (invoices.length === 0) {
      await this.prisma.giveaway.update({
        where: { id: giveaway.id },
        data: { status: GiveawayStatusEnum.FINISHED },
      });
      return { message: 'Nenhum nota encontrada, sorteio finalizado sem ganhador!!' };
    }

    const winnerNumber = Math.floor(Math.random() * invoices.length);

    const luckyInvoice = invoices[winnerNumber];

    const [winner] = await this.prisma.$transaction([
      this.prisma.giveaway.update({
        where: { id: luckyInvoice.giveawayId },
        data: {
          winnerId: luckyInvoice.userId,
          status: GiveawayStatusEnum.FINISHED,
        },
        include: this.giveawayWinnerIncludes,
      }),
      this.prisma.invoice.update({
        where: { luckyCode: luckyInvoice.luckyCode },
        data: {
          status: InvoiceGiveawayStatusEnum.WINNER,
        },
      }),
      this.prisma.invoice.updateMany({
        where: { AND: [{ giveawayId: giveaway.id }, { id: { not: luckyInvoice.id } }] },
        data: {
          status: InvoiceGiveawayStatusEnum.LOSER,
        },
      }),
    ]);

    return { winner, message: 'Sorteio finalizado com sucesso!' };
  }
}
