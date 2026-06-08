import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CheckHabitDto {
  @IsDateString()
  date: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsInt()
  @IsOptional()
  userId?: number;
}
