import { TransactionType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFinanceTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  transactionDate: string;

  @IsInt()
  userId: number;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}
