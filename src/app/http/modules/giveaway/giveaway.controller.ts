import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthorizationGuard } from '../../guards/auth.guard';
import { GiveawayService } from './giveaway.service';
import { CreateGiveawayDTO } from './interfaces/create';
import { UpdateGiveawayDTO } from './interfaces/update';

@Controller(`${process.env.BASE_API_PREFIX}/giveaway`)
@UsePipes(ValidationPipe)
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Get('/all')
  getAll() {
    return this.giveawayService.getAll();
  }

  @Get('/active')
  getActive() {
    return this.giveawayService.getActiveGiveaway();
  }

  @Post('/create')
  @UseGuards(AuthorizationGuard)
  create(@Body() body: CreateGiveawayDTO) {
    return this.giveawayService.create(body);
  }

  @Patch('/update/:id')
  @UseGuards(AuthorizationGuard)
  update(@Param('id') id: string, @Body() body: UpdateGiveawayDTO) {
    return this.giveawayService.update(id, body);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthorizationGuard)
  delete(@Param('id') id: string) {
    return this.giveawayService.delete(id);
  }

  @Get('/teste')
  teste() {
    return this.giveawayService.sortGiveawayWinner();
  }
}
