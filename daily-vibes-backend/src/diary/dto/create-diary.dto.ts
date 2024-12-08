import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  vibe: string;

  @IsString()
  @IsNotEmpty()
  contentDate?: string;
}
