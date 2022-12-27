import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'database/prisma/prisma.service';
import { CreateUserDTO } from './interfaces/create';
import { sign } from 'jsonwebtoken';

import { compare, hash } from 'bcryptjs';
import { AuthCredentialsDTO } from './interfaces/auth';
import { UserEntity } from 'database/Entities/user.entity';
import { UpdateUserDTO } from './interfaces/update';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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
}
