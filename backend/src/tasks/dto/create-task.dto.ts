import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Priority, TaskStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Estudiar NestJS',
    description: 'Título principal de la tarea',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    example: 'Conectar Prisma con PostgreSQL',
    description: 'Descripción detallada de la tarea',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    description: 'Estado actual de la tarea',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: Priority,
    example: Priority.HIGH,
    description: 'Prioridad de la tarea',
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiPropertyOptional({
    example: '2026-05-25T10:00:00.000Z',
    description: 'Fecha límite de la tarea en formato ISO 8601',
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
