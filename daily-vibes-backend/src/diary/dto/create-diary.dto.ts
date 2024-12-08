import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaryDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  contentDate?: string;
}
