import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Injectable()
export class CalendarEventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCalendarEventDto: CreateCalendarEventDto) {
    return this.prisma.calendarEvent.create({
      data: {
        title: createCalendarEventDto.title,
        description: createCalendarEventDto.description,
        startDate: new Date(createCalendarEventDto.startDate),
        endDate: createCalendarEventDto.endDate
          ? new Date(createCalendarEventDto.endDate)
          : undefined,
        location: createCalendarEventDto.location,
        userId: createCalendarEventDto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.calendarEvent.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.calendarEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with id ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateCalendarEventDto: UpdateCalendarEventDto) {
    await this.findOne(id);

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
        userId: updateCalendarEventDto.userId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.calendarEvent.delete({
      where: { id },
    });
  }
}
