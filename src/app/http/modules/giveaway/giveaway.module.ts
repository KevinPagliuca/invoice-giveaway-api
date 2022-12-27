import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'database/database.module';
import { GiveawayController } from './giveaway.controller';
import { GiveawayService } from './giveaway.service';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot()],
  providers: [GiveawayService],
  controllers: [GiveawayController],
  exports: [GiveawayService],
})
export class GiveawayModule {}
