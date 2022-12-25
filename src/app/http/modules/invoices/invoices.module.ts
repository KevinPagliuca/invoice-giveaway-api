import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

import { DatabaseModule } from 'database/database.module';
import { UsersService } from '../users/users.service';
@Module({
  imports: [DatabaseModule],
  providers: [InvoicesService, UsersService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
