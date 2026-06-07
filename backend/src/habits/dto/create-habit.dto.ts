import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HabitStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateHabitDto {
  @ApiProperty({
    example: 'Ejercicio matutino',
    description: 'Nombre del hábito',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({
    example: '30 minutos de cardio en casa',
    description: 'Descripción del hábito',
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({
    enum: HabitStatus,
    example: HabitStatus.PENDING,
    description: 'Estado actual del hábito',
  })
  @IsEnum(HabitStatus)
  @IsOptional()
  status?: HabitStatus;

  @ApiPropertyOptional({
    example: 7,
    description: 'Meta de días para la racha del hábito',
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  targetDays?: number;

  @ApiPropertyOptional({
    example: 0,
    description: 'Racha actual del hábito',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  streak?: number;
}
