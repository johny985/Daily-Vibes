import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto, qr: QueryRunner) {
    const existingUser = await this.findOne(createUserDto.email);

    if (existingUser) return 'User already exists';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const userToSave = {
      ...createUserDto,
      password: hashedPassword,
    };

    await qr.manager.save(User, userToSave);
    return { message: 'User created successfully' };
  }

  findOne(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}
