import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { DatabaseModule } from 'database/database.module';
import { SendgridService } from '../sendgrid/sendgrid.service';
@Module({
  imports: [DatabaseModule],
  providers: [UsersService, SendgridService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
