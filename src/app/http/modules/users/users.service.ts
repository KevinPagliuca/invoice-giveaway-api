import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO } from './interfaces/create';
import { sign } from 'jsonwebtoken';

import { compare, hash } from 'bcryptjs';
import { AuthCredentialsDTO } from './interfaces/auth';
import { UpdateUserDTO } from './interfaces/update';
import { RecoverPasswordDTO, ResetPasswordDTO } from './interfaces/recover-password';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { generateRandomId } from '../../../../utils/generate-id';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sendgridService: SendgridService
  ) {}

  private generateJWT(userId: string) {
    return sign({ userId }, process.env.JWT_SECRET, {
      subject: userId,
      expiresIn: '1d',
    });
  }

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => new UserEntity(user));
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user && new UserEntity(user);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user && new UserEntity(user);
  }

  async getUserByCPF(cpf: string) {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });

    return user && new UserEntity(user);
  }

  async create(body: CreateUserDTO) {
    const hashedPassword = await hash(body.password, 10);
    const userByCPF = await this.getUserByCPF(body.cpf);
    const userByEmail = await this.getUserByEmail(body.email);

    if (userByCPF) throw new BadRequestException('CPF já cadastrado');
    if (userByEmail) throw new BadRequestException('E-mail já cadastrado');
    const birthDate = new Date(body.birthDate);
    birthDate.setUTCHours(12, 0, 0, 0);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...body,
          birthDate,
          password: hashedPassword,
        },
      });

      const token = this.generateJWT(newUser.id);

      return { user: new UserEntity(newUser), token };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro interno ao tentar criar o usuário, tente novamente mais tarde'
      );
    }
  }

  async update(id: string, body: UpdateUserDTO) {
    const user = await this.getUserById(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const birthDate = body.birthDate ? new Date(body.birthDate) : new Date(user.birthDate);
    birthDate.setUTCHours(12, 0, 0, 0);
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...body,
          birthDate,
        },
      });

      return new UserEntity(updatedUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro interno ao tentar atualizar o usuário, tente novamente mais tarde'
      );
    }
  }

  async delete(id: string) {
    const user = await this.getUserById(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocorreu um erro interno ao tentar deletar o usuário, tente novamente mais tarde'
      );
    }
  }

  async auth({ cpf, password }: AuthCredentialsDTO) {
    const user = await this.getUserByCPF(cpf);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) throw new BadRequestException('E-mail ou senha inválidos');

    const token = this.generateJWT(user.id);

    return { user: new UserEntity(user), token };
  }

  async recoverPassword(recoverPassword: RecoverPasswordDTO) {
    const user = await this.getUserByCPF(recoverPassword.cpf);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const recoverPassCode = generateRandomId(6);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { recoverPassCode },
    });

    await this.sendgridService.send({
      from: process.env.SENDGRID_SENDER_EMAIL,
      to: user.email,
      templateId: 'd-1c75f9c61fba4e2099af3893a41e05f8',
      dynamicTemplateData: {
        username: user.name,
        code: recoverPassCode,
      },
    });

    return { message: 'Código para redefinição de senha enviado para o e-mail: ' + user.email };
  }

  async resetPassword({ code, confirmation, cpf, password }: ResetPasswordDTO) {
    if (password !== confirmation) throw new BadRequestException('As senhas não conferem');

    const user = await this.getUserByCPF(cpf);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (user.recoverPassCode !== code)
      throw new UnauthorizedException('Código de recuperação inválido');

    const hashedPassword = await hash(password, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, recoverPassCode: null },
    });

    return { message: 'Senha alterada com sucesso!' };
  }
}
