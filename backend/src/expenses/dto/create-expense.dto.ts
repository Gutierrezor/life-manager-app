import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseCategory } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Almuerzo',
    description: 'Nombre o título del gasto',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 18000,
    description: 'Valor del gasto',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    enum: ExpenseCategory,
    example: ExpenseCategory.FOOD,
    description: 'Categoría del gasto',
  })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiPropertyOptional({
    example: 'Almuerzo en la universidad',
    description: 'Descripción opcional del gasto',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: '2026-05-24T12:30:00.000Z',
    description: 'Fecha del gasto en formato ISO 8601',
  })
  @IsDateString()
  @IsOptional()
  expenseDate?: string;
}
