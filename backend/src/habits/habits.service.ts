import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CheckHabitDto } from './dto/check-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createHabitDto: CreateHabitDto) {
    return this.prisma.habit.create({
      data: {
        name: createHabitDto.name,
        description: createHabitDto.description,
        frequency: createHabitDto.frequency,
        goal: createHabitDto.goal,
        color: createHabitDto.color,
        userId: createHabitDto.userId,
      },
      include: {
        logs: true,
      },
    });
  }

  findAll() {
    return this.prisma.habit.findMany({
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

  async findOne(id: number) {
    const habit = await this.prisma.habit.findUnique({
      where: { id },
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

  async update(id: number, updateHabitDto: UpdateHabitDto) {
    await this.findOne(id);

    return this.prisma.habit.update({
      where: { id },
      data: {
        name: updateHabitDto.name,
        description: updateHabitDto.description,
        frequency: updateHabitDto.frequency,
        goal: updateHabitDto.goal,
        color: updateHabitDto.color,
        userId: updateHabitDto.userId,
      },
      include: {
        logs: true,
      },
    });
  }

  async checkHabit(id: number, checkHabitDto: CheckHabitDto) {
    await this.findOne(id);

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
        userId: checkHabitDto.userId,
        date: new Date(checkHabitDto.date),
        completed: checkHabitDto.completed ?? true,
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
