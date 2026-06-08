import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    await this.ensureCategoryBelongsToUser(createNoteDto.categoryId, userId);

    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        isFavorite: createNoteDto.isFavorite,
        userId,
        categoryId: createNoteDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    await this.findOne(id, userId);
    await this.ensureCategoryBelongsToUser(updateNoteDto.categoryId, userId);

    return this.prisma.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        isFavorite: updateNoteDto.isFavorite,
        categoryId: updateNoteDto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.note.delete({
      where: { id },
    });
  }

  private async ensureCategoryBelongsToUser(categoryId: number | undefined, userId: number) {
    if (!categoryId) {
      return;
    }

    const category = await this.prisma.noteCategory.findFirst({
      where: { id: categoryId, userId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException(`Note category with id ${categoryId} not found`);
    }
  }
}
