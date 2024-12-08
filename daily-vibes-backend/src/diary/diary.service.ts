import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
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

  async create(createDiaryDto: CreateDiaryDto) {
    //TODO: user id to current logged in id
    const userId = 1;

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const vibe = await this.getVibe(createDiaryDto.content);

    return await this.diaryRepository.save({
      ...createDiaryDto,
      vibe,
      user,
    });
  }

  private async getVibe(content: string) {
    const openai = this.openAIProvider.getInstance();
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

    return response.choices[0].message.content;
  }

  async findAll(year, month) {
    //TODO: user id to current logged in id
    const userId = 1;

    return await this.diaryRepository.find({
      where: {
        user: { id: userId },
        contentDate: Like(`${month}/%/${year}`),
      },
      relations: ['user'],
    });
  }

  async findOne(date: string) {
    const content = await this.diaryRepository.findOne({
      where: { contentDate: date },
    });

    return content;
  }

  update(id: number, updateDiaryDto: UpdateDiaryDto) {
    return `This action updates a #${id} diary`;
  }

  remove(id: number) {
    return `This action removes a #${id} diary`;
  }
}
