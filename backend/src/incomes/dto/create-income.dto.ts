import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({
    example: 'Salario mensual',
    description: 'Descripción principal del ingreso',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 1200000,
    description: 'Valor del ingreso',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    example: 'Pago por freelance',
    description: 'Origen o fuente del ingreso',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  source?: string;

  @ApiPropertyOptional({
    example: '2026-05-24T12:30:00.000Z',
    description: 'Fecha del ingreso en formato ISO 8601',
  })
  @IsDateString()
  @IsOptional()
  incomeDate?: string;
}
