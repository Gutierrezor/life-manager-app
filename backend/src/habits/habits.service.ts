import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHabitDto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: {
        name: createHabitDto.name,
        description: createHabitDto.description,
        status: createHabitDto.status,
        streak: createHabitDto.streak ?? 0,
        targetDays: createHabitDto.targetDays ?? 7,
      },
    });
  }

  async findAll() {
    return this.prisma.habit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with id ${id} not found`);
    }

    return habit;
  }

  async update(id: number, updateHabitDto: UpdateHabitDto) {
    await this.findOne(id);

    return this.prisma.habit.update({
      where: { id },
      data: {
        name: updateHabitDto.name,
        description: updateHabitDto.description,
        status: updateHabitDto.status,
        streak: updateHabitDto.streak,
        targetDays: updateHabitDto.targetDays,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.habit.delete({
      where: { id },
    });
  }
}
