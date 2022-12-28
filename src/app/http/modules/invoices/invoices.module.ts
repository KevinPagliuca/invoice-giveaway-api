import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../database/database.module';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';

@Module({
  imports: [DatabaseModule],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
