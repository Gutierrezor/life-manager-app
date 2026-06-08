import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarEventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCalendarEventDto: CreateCalendarEventDto, userId: number) {
    return this.prisma.calendarEvent.create({
      data: {
        title: createCalendarEventDto.title,
        description: createCalendarEventDto.description,
        startDate: new Date(createCalendarEventDto.startDate),
        endDate: createCalendarEventDto.endDate
          ? new Date(createCalendarEventDto.endDate)
          : undefined,
        location: createCalendarEventDto.location,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number) {
    const event = await this.prisma.calendarEvent.findFirst({
      where: { id, userId },
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with id ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateCalendarEventDto: UpdateCalendarEventDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.calendarEvent.update({
      where: { id },
      data: {
        title: updateCalendarEventDto.title,
        description: updateCalendarEventDto.description,
        startDate: updateCalendarEventDto.startDate
          ? new Date(updateCalendarEventDto.startDate)
          : undefined,
        endDate: updateCalendarEventDto.endDate
          ? new Date(updateCalendarEventDto.endDate)
          : undefined,
        location: updateCalendarEventDto.location,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.calendarEvent.delete({
      where: { id },
    });
  }
}
