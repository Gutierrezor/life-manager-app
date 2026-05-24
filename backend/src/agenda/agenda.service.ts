import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAgendaDto: CreateAgendaDto) {
    const startTime = new Date(createAgendaDto.startTime);
    const endTime = new Date(createAgendaDto.endTime);

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    return this.prisma.agendaEvent.create({
      data: {
        title: createAgendaDto.title,
        description: createAgendaDto.description,
        startTime,
        endTime,
        location: createAgendaDto.location,
      },
    });
  }

  async findAll() {
    return this.prisma.agendaEvent.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.agendaEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Agenda event with id ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateAgendaDto: UpdateAgendaDto) {
    const currentEvent = await this.findOne(id);

    const startTime = updateAgendaDto.startTime
      ? new Date(updateAgendaDto.startTime)
      : currentEvent.startTime;

    const endTime = updateAgendaDto.endTime
      ? new Date(updateAgendaDto.endTime)
      : currentEvent.endTime;

    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    return this.prisma.agendaEvent.update({
      where: { id },
      data: {
        title: updateAgendaDto.title,
        description: updateAgendaDto.description,
        startTime: updateAgendaDto.startTime ? startTime : undefined,
        endTime: updateAgendaDto.endTime ? endTime : undefined,
        location: updateAgendaDto.location,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.agendaEvent.delete({
      where: { id },
    });
  }
}
