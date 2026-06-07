import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        isFavorite: createNoteDto.isFavorite,
        userId: createNoteDto.userId,
        categoryId: createNoteDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  findAll() {
    return this.prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        isFavorite: updateNoteDto.isFavorite,
        userId: updateNoteDto.userId,
        categoryId: updateNoteDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.note.delete({
      where: { id },
    });
  }
}
