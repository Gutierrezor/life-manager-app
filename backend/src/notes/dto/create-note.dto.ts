import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsInt()
  userId: number;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}
