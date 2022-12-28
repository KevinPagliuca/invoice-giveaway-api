import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuthorizationGuard } from '../../guards/auth.guard';
import { ICurrentUser } from '../users/interfaces/auth';
import { CreateInvoiceDTO } from './interfaces/create';
import { UpdateInvoiceDTO } from './interfaces/update';

import { InvoicesService } from './invoices.service';

@Controller(`${process.env.BASE_API_PREFIX}/invoice`)
@UsePipes(ValidationPipe)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/all')
  @UseGuards(AuthorizationGuard)
  getAllInvoices() {
    return this.invoicesService.getAll();
  }

  @Get('/find/:id')
  @UseGuards(AuthorizationGuard)
  getInvoiceById(@Param('id') id: string) {
    return this.invoicesService.getById(id);
  }

  @Get('/mine')
  @UseGuards(AuthorizationGuard)
  getMyInvoices(@CurrentUser() { user }: ICurrentUser) {
    return this.invoicesService.getByUserId(user.id);
  }

  @Post('/create')
  @UseGuards(AuthorizationGuard)
  createInvoice(@Body() body: CreateInvoiceDTO, @CurrentUser() { user }: ICurrentUser) {
    return this.invoicesService.create(body, user.id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthorizationGuard)
  updateInvoice(@Param('id') id: string, @Body() body: UpdateInvoiceDTO) {
    return this.invoicesService.update(id, body);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthorizationGuard)
  deleteInvoice(@Param('id') id: string) {
    return this.invoicesService.delete(id);
  }

  @Get('/user/:id')
  @UseGuards(AuthorizationGuard)
  getInvoicesByUserId(@Param('id') id: string) {
    return this.invoicesService.getByUserId(id);
  }
}
