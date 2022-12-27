import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { verify } from 'jsonwebtoken';

import { UserEntity } from 'database/Entities/user.entity';
import { PrismaService } from 'database/prisma/prisma.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Não autenticado, token não encontrado');

    const { sub: userId } = verify(token, process.env.JWT_SECRET);

    const user = await this.prisma.user.findUnique({
      where: { id: userId as string },
    });

    if (!user)
      throw new NotFoundException('Você não está autenticado, o usuário desse token não existe');

    req.user = new UserEntity(user);
    req.token = token;
    return true;
  }
}
