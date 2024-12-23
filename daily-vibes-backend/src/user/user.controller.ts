import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { QueryRunner } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    const qr: QueryRunner = req.queryRunner;
    return this.userService.create(createUserDto, qr);
  }

  @Get('findUser')
  async findUser(@Query('email') email: string) {
    const result = (await this.userService.findOne(email)) || {};
    return result;
  }
}
