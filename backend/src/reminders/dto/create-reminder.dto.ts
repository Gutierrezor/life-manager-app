import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReminderStatus } from '@prisma/client';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  remindAt: string;

  @IsEnum(ReminderStatus)
  @IsOptional()
  status?: ReminderStatus;

  @IsInt()
  @IsOptional()
  userId?: number;
}
