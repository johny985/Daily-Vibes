import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { Like, Repository } from 'typeorm';
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

  async save(createDiaryDto: CreateDiaryDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingDiary = await this.diaryRepository.findOne({
      where: {
        user: { id: userId },
        contentDate: createDiaryDto.contentDate,
      },
    });

    const vibe = await this.getVibe(createDiaryDto.content);

    if (existingDiary) {
      existingDiary.content = createDiaryDto.content;
      existingDiary.vibe = vibe;

      return await this.diaryRepository.save(existingDiary);
    }

    const newDiary = this.diaryRepository.create({
      ...createDiaryDto,
      vibe,
      user,
    });

    return await this.diaryRepository.save(newDiary);
  }

  private async getVibe(content: string): Promise<string> {
    const allowedEmotions = ['Happy', 'Sad', 'Exhausted', 'Angry'];
    const openai = this.openAIProvider.getInstance();

    let emotion: string | undefined;

    while (!allowedEmotions.includes(emotion)) {
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
                      **Make sure to only respond with the emotion.**
            `,
          },
        ],
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
        max_tokens: 10,
      });

      emotion = response.choices[0]?.message.content.trim();
    }

    return emotion;
  }

  async findAll(year, month, userId: number) {
    const vibes = await this.diaryRepository.find({
      where: {
        user: { id: userId },
        contentDate: Like(`${month}/%/${year}`),
      },
      relations: ['user'],
    });

    return vibes;
  }

  async findOne(date: string, userId: number) {
    const content = await this.diaryRepository.findOne({
      where: { contentDate: date, user: { id: userId } },
    });

    return content;
  }

  remove(date: string, userId: number) {
    return this.diaryRepository.delete({
      contentDate: date,
      user: { id: userId },
    });
  }
}
