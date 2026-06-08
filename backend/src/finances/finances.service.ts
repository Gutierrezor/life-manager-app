import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto';
import { CreateFinanceTransactionDto } from './dto/create-finance-transaction.dto';

@Injectable()
export class FinancesService {
  constructor(private readonly prisma: PrismaService) {}

  createCategory(createFinanceCategoryDto: CreateFinanceCategoryDto, userId: number) {
    return this.prisma.financeCategory.create({
      data: {
        name: createFinanceCategoryDto.name,
        type: createFinanceCategoryDto.type,
        color: createFinanceCategoryDto.color,
        userId,
      },
    });
  }

  findAllCategories(userId: number) {
    return this.prisma.financeCategory.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        transactions: true,
      },
    });
  }

  async createTransaction(createFinanceTransactionDto: CreateFinanceTransactionDto, userId: number) {
    await this.ensureCategoryBelongsToUser(
      createFinanceTransactionDto.categoryId,
      createFinanceTransactionDto.type,
      userId,
    );

    return this.prisma.financeTransaction.create({
      data: {
        type: createFinanceTransactionDto.type,
        amount: createFinanceTransactionDto.amount,
        description: createFinanceTransactionDto.description,
        transactionDate: new Date(createFinanceTransactionDto.transactionDate),
        userId,
        categoryId: createFinanceTransactionDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  findAllTransactions(userId: number) {
    return this.prisma.financeTransaction.findMany({
      where: { userId },
      orderBy: {
        transactionDate: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async findOneTransaction(id: number, userId: number) {
    const transaction = await this.prisma.financeTransaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Finance transaction with id ${id} not found`);
    }

    return transaction;
  }

  async removeTransaction(id: number, userId: number) {
    await this.findOneTransaction(id, userId);

    return this.prisma.financeTransaction.delete({
      where: { id },
    });
  }

  async getSummary(userId: number) {
    const transactions = await this.prisma.financeTransaction.findMany({
      where: { userId },
    });

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

  private async ensureCategoryBelongsToUser(
    categoryId: number | undefined,
    type: TransactionType,
    userId: number,
  ) {
    if (!categoryId) {
      return;
    }

    const category = await this.prisma.financeCategory.findFirst({
      where: { id: categoryId, type, userId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException(`Finance category with id ${categoryId} not found`);
    }
  }
}
