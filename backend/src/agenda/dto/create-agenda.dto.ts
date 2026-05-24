import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAgendaDto {
  @ApiProperty({
    example: 'Estudiar bases de datos',
    description: 'Título del evento de agenda',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    example: 'Repasar normalización y consultas SQL',
    description: 'Descripción opcional del evento',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '2026-05-25T14:00:00.000Z',
    description: 'Fecha y hora de inicio del evento',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2026-05-25T16:00:00.000Z',
    description: 'Fecha y hora de finalización del evento',
  })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({
    example: 'Casa',
    description: 'Lugar del evento',
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  location?: string;
}
