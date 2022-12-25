import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from 'app/http/decorators/current-user.decorator';
import { AuthorizationGuard } from 'app/http/guards/auth.guard';
import { AuthCredentialsDTO, ICurrentUser } from './interfaces/auth';
import { CreateUserDTO } from './interfaces/create';
import { UpdateUserDTO } from './interfaces/update';
import { UsersService } from './users.service';

@Controller(`${process.env.BASE_API_PREFIX}/user`)
@UsePipes(ValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @UseGuards(AuthorizationGuard)
  getUsers() {
    return this.usersService.getAll();
  }

  @Get('/me')
  @UseGuards(AuthorizationGuard)
  getMe(@CurrentUser() user: ICurrentUser) {
    return user;
  }

  @Get('/find/:id')
  @UseGuards(AuthorizationGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post('/register')
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.usersService.create(createUserDTO);
  }

  @Post('/auth')
  auth(@Body() authCredentialsDTO: AuthCredentialsDTO) {
    return this.usersService.auth(authCredentialsDTO);
  }

  @Patch('/update')
  @UseGuards(AuthorizationGuard)
  updateMe(@Body() updateUserDTO: UpdateUserDTO, @CurrentUser() { user }: ICurrentUser) {
    return this.usersService.update(user.id, updateUserDTO);
  }

  @Patch('/update/:id')
  @UseGuards(AuthorizationGuard)
  updateUserById(@Param('id') id: string, @Body() updateUserDTO: UpdateUserDTO) {
    return this.usersService.update(id, updateUserDTO);
  }

  @Delete('/delete-me')
  @UseGuards(AuthorizationGuard)
  deleteMe(@CurrentUser() { user }: ICurrentUser) {
    return this.usersService.delete(user.id);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthorizationGuard)
  deleteUserById(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
