import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReminderDto: CreateReminderDto, userId: number) {
    return this.prisma.reminder.create({
      data: {
        title: createReminderDto.title,
        description: createReminderDto.description,
        remindAt: new Date(createReminderDto.remindAt),
        status: createReminderDto.status,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.reminder.findMany({
      where: { userId },
      orderBy: {
        remindAt: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with id ${id} not found`);
    }

    return reminder;
  }

  async update(id: number, updateReminderDto: UpdateReminderDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.reminder.update({
      where: { id },
      data: {
        title: updateReminderDto.title,
        description: updateReminderDto.description,
        remindAt: updateReminderDto.remindAt
          ? new Date(updateReminderDto.remindAt)
          : undefined,
        status: updateReminderDto.status,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.reminder.delete({
      where: { id },
    });
  }
}
