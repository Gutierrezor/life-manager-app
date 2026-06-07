import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIncomeDto: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        title: createIncomeDto.title,
        amount: createIncomeDto.amount,
        source: createIncomeDto.source,
        incomeDate: createIncomeDto.incomeDate
          ? new Date(createIncomeDto.incomeDate)
          : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.income.findMany({
      orderBy: {
        incomeDate: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const income = await this.prisma.income.findUnique({
      where: { id },
    });

    if (!income) {
      throw new NotFoundException(`Income with id ${id} not found`);
    }

    return income;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    await this.findOne(id);

    return this.prisma.income.update({
      where: { id },
      data: {
        title: updateIncomeDto.title,
        amount: updateIncomeDto.amount,
        source: updateIncomeDto.source,
        incomeDate: updateIncomeDto.incomeDate
          ? new Date(updateIncomeDto.incomeDate)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.income.delete({
      where: { id },
    });
  }
}
