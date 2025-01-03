import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { Like, QueryRunner, Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { OpenAIProvider } from 'src/openai/openai.provider';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly openAIProvider: OpenAIProvider,
  ) {}

  private requestTimestamps: Map<string, number[]> = new Map();
  private readonly limit = 30;
  private readonly ttl = 60 * 1000;

  async save(createDiaryDto: CreateDiaryDto, userId: number, qr: QueryRunner) {
    const user = await qr.manager.findOne(User, {
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingDiary = await qr.manager.findOne(Diary, {
      where: {
        user: { id: userId },
        contentDate: createDiaryDto.contentDate,
      },
    });

    const vibe = await this.getVibe(createDiaryDto.content, userId);

    if (existingDiary) {
      existingDiary.content = createDiaryDto.content;
      existingDiary.vibe = vibe;

      return await qr.manager.save(existingDiary);
    }

    const newDiary = this.diaryRepository.create({
      ...createDiaryDto,
      vibe,
      user,
    });

    return await qr.manager.save(newDiary);
  }

  private throttleRequest(userId: string): void {
    const now = Date.now();
    const timestamps = this.requestTimestamps.get(userId) || [];

    const filteredTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.ttl,
    );

    if (filteredTimestamps.length >= this.limit) {
      throw new Error('Too Many Requests');
    }

    filteredTimestamps.push(now);
    this.requestTimestamps.set(userId, filteredTimestamps);
  }

  async getVibe(
    content: string,
    userId: string | number = 'tempUser',
  ): Promise<string> {
    this.throttleRequest(String(userId));

    const allowedEmotions = ['Happy', 'Sad', 'Exhausted', 'Angry'];
    const openai = this.openAIProvider.getInstance();
    const maxTrial = 20;

    let trial = 0;
    let vibe: string | undefined;

    while (trial < maxTrial) {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content,
          },
          {
            role: 'system',
            content: `Select the most fitting emotion based on the content:
                    Happy, Sad, Exhausted, Angry
                    **Make sure to only respond with the emotion.**`,
          },
        ],
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
        max_tokens: 10,
      });

      vibe = response.choices[0]?.message.content.trim();
      trial++;

      if (allowedEmotions.includes(vibe)) {
        return vibe;
      }
    }

    throw new Error('Please try again with a different prompt');
  }

  async findAll(year, month, userId: number | undefined) {
    const vibes = await this.diaryRepository.find({
      where: {
        user: { id: userId },
        contentDate: Like(`${month}/%/${year}`),
      },
      relations: ['user'],
    });

    return vibes;
  }

  async findOne(date: string, userId: number | undefined) {
    const content = await this.diaryRepository.findOne({
      where: { contentDate: date, user: { id: userId } },
    });

    return content || [];
  }

  remove(date: string, userId: number) {
    return this.diaryRepository.delete({
      contentDate: date,
      user: { id: userId },
    });
  }
}
