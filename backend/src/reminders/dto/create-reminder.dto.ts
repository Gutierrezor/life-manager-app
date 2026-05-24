import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, ReminderStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReminderDto {
  @ApiProperty({
    example: 'Tomar agua',
    description: 'Título del recordatorio',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    example: 'Recordarme tomar agua durante el día',
    description: 'Descripción opcional del recordatorio',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '2026-05-25T08:00:00.000Z',
    description: 'Fecha y hora del recordatorio en formato ISO 8601',
  })
  @IsDateString()
  remindAt: string;

  @ApiPropertyOptional({
    enum: ReminderStatus,
    example: ReminderStatus.PENDING,
    description: 'Estado del recordatorio',
  })
  @IsEnum(ReminderStatus)
  @IsOptional()
  status?: ReminderStatus;

  @ApiPropertyOptional({
    enum: Priority,
    example: Priority.MEDIUM,
    description: 'Prioridad del recordatorio',
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
