import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteCategoryDto } from './dto/create-note-category.dto';
import { UpdateNoteCategoryDto } from './dto/update-note-category.dto';

@Injectable()
export class NoteCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteCategoryDto: CreateNoteCategoryDto, userId: number) {
    return this.prisma.noteCategory.create({
      data: {
        name: createNoteCategoryDto.name,
        color: createNoteCategoryDto.color,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.noteCategory.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        notes: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const category = await this.prisma.noteCategory.findFirst({
      where: { id, userId },
      include: {
        notes: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Note category with id ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateNoteCategoryDto: UpdateNoteCategoryDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.noteCategory.update({
      where: { id },
      data: {
        name: updateNoteCategoryDto.name,
        color: updateNoteCategoryDto.color,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.noteCategory.delete({
      where: { id },
    });
  }
}
