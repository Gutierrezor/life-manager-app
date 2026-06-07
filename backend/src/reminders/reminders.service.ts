import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createReminderDto: CreateReminderDto) {
    return this.prisma.reminder.create({
      data: {
        title: createReminderDto.title,
        description: createReminderDto.description,
        remindAt: new Date(createReminderDto.remindAt),
        status: createReminderDto.status,
        userId: createReminderDto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.reminder.findMany({
      orderBy: {
        remindAt: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { id },
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with id ${id} not found`);
    }

    return reminder;
  }

  async update(id: number, updateReminderDto: UpdateReminderDto) {
    await this.findOne(id);

    return this.prisma.reminder.update({
      where: { id },
      data: {
        title: updateReminderDto.title,
        description: updateReminderDto.description,
        remindAt: updateReminderDto.remindAt
          ? new Date(updateReminderDto.remindAt)
          : undefined,
        status: updateReminderDto.status,
        userId: updateReminderDto.userId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reminder.delete({
      where: { id },
    });
  }
}
