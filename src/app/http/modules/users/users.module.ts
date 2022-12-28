import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { SendgridService } from '../sendgrid/sendgrid.service';
import { DatabaseModule } from '../../../../database/database.module';
@Module({
  imports: [DatabaseModule],
  providers: [UsersService, SendgridService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
