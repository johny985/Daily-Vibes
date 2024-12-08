import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './entities/diary.entity';
import { User } from 'src/user/entities/user.entity';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, User]), OpenAIModule],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
