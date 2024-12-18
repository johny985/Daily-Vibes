import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('findUser')
  async findUser(@Query('email') email: string) {
    const result = (await this.userService.findOne(email)) || {};
    return result;
  }
}
