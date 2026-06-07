import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto';
import { CreateFinanceTransactionDto } from './dto/create-finance-transaction.dto';

@Injectable()
export class FinancesService {
  constructor(private readonly prisma: PrismaService) {}

  createCategory(createFinanceCategoryDto: CreateFinanceCategoryDto) {
    return this.prisma.financeCategory.create({
      data: {
        name: createFinanceCategoryDto.name,
        type: createFinanceCategoryDto.type,
        color: createFinanceCategoryDto.color,
        userId: createFinanceCategoryDto.userId,
      },
    });
  }

  findAllCategories() {
    return this.prisma.financeCategory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        transactions: true,
      },
    });
  }

  createTransaction(createFinanceTransactionDto: CreateFinanceTransactionDto) {
    return this.prisma.financeTransaction.create({
      data: {
        type: createFinanceTransactionDto.type,
        amount: createFinanceTransactionDto.amount,
        description: createFinanceTransactionDto.description,
        transactionDate: new Date(createFinanceTransactionDto.transactionDate),
        userId: createFinanceTransactionDto.userId,
        categoryId: createFinanceTransactionDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  findAllTransactions() {
    return this.prisma.financeTransaction.findMany({
      orderBy: {
        transactionDate: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async findOneTransaction(id: number) {
    const transaction = await this.prisma.financeTransaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Finance transaction with id ${id} not found`);
    }

    return transaction;
  }

  async removeTransaction(id: number) {
    await this.findOneTransaction(id);

    return this.prisma.financeTransaction.delete({
      where: { id },
    });
  }

  async getSummary() {
    const transactions = await this.prisma.financeTransaction.findMany();

    const income = transactions
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const expense = transactions
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      totalTransactions: transactions.length,
    };
  }
}
