import { TransactionType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFinanceCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsOptional()
  color?: string;

  @IsInt()
  userId: number;
}
