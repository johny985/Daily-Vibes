import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BaseTable } from 'src/common/entity/base-table.entity';

@Entity()
export class Diary extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  vibe: string;

  @ManyToOne(() => User, (user) => user.diaries, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  contentDate: string;
}
