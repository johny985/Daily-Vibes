import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Controller('diary')
@UseInterceptors(ClassSerializerInterceptor)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
    return this.diaryService.update(+id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryService.remove(+id);
  }
}
