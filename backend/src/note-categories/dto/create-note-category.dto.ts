import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsInt()
  userId: number;
}
