import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseInterceptors,
  Request,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('diary')
@UseInterceptors(ClassSerializerInterceptor)
// @UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createDiaryDto: CreateDiaryDto, @Request() req) {
    const userId = req?.user?.userId;

    return this.diaryService.save(createDiaryDto, userId);
  }

  @Get()
  async find(
    @Request() req,
    @Query('date') date?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const userId = req?.user?.userId;

    if (date) {
      return await this.diaryService.findOne(date, userId);
    } else {
      return this.diaryService.findAll(year, month, userId);
    }
  }

  @Delete()
  remove(@Query('date') date: string, @Request() req) {
    const userId = req.user.userId;

    return this.diaryService.remove(date, userId);
  }

  @Post('vibe')
  async getVibe(@Body() body) {
    const vibe = await this.diaryService.getVibe(body.content);
    return { vibe };
  }
}
