import { Module } from '@nestjs/common';
import { GiveawayModule } from './modules/giveaway/giveaway.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, InvoicesModule, GiveawayModule],
  providers: [],
  controllers: [],
})
export class HttpModule {}
