import { HabitFrequency } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHabitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(HabitFrequency)
  @IsOptional()
  frequency?: HabitFrequency;

  @IsInt()
  @IsOptional()
  goal?: number;

  @IsString()
  @IsOptional()
  color?: string;

  @IsInt()
  @IsOptional()
  userId?: number;
}
