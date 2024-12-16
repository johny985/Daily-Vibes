import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@Controller('diary')
@UseInterceptors(ClassSerializerInterceptor)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createDiaryDto: CreateDiaryDto) {
    return this.diaryService.save(createDiaryDto);
  }

  @Get()
  async find(
    @Query('date') date?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    if (date) {
      return (await this.diaryService.findOne(date)) || {};
    } else {
      return this.diaryService.findAll(year, month);
    }
  }

  @Delete()
  remove(@Query('date') date: string) {
    return this.diaryService.remove(date);
  }
}
