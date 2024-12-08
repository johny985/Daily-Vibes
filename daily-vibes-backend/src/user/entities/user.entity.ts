import { BaseTable } from 'src/common/entity/base-table.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Diary } from 'src/diary/entities/diary.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Diary, (diary) => diary.user)
  diaries: Diary[];
}
