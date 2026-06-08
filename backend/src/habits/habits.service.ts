import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CheckHabitDto } from './dto/check-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createHabitDto: CreateHabitDto, userId: number) {
    return this.prisma.habit.create({
      data: {
        name: createHabitDto.name,
        description: createHabitDto.description,
        frequency: createHabitDto.frequency,
        goal: createHabitDto.goal,
        color: createHabitDto.color,
        userId,
      },
      include: {
        logs: true,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        logs: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
      include: {
        logs: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with id ${id} not found`);
    }

    return habit;
  }

  async update(id: number, updateHabitDto: UpdateHabitDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.habit.update({
      where: { id },
      data: {
        name: updateHabitDto.name,
        description: updateHabitDto.description,
        frequency: updateHabitDto.frequency,
        goal: updateHabitDto.goal,
        color: updateHabitDto.color,
      },
      include: {
        logs: true,
      },
    });
  }

  async checkHabit(id: number, checkHabitDto: CheckHabitDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: id,
          date: new Date(checkHabitDto.date),
        },
      },
      update: {
        completed: checkHabitDto.completed ?? true,
      },
      create: {
        habitId: id,
        userId,
        date: new Date(checkHabitDto.date),
        completed: checkHabitDto.completed ?? true,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.habit.delete({
      where: { id },
    });
  }
}
