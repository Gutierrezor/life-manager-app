import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteCategoryDto } from './dto/create-note-category.dto';
import { UpdateNoteCategoryDto } from './dto/update-note-category.dto';

@Injectable()
export class NoteCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteCategoryDto: CreateNoteCategoryDto) {
    return this.prisma.noteCategory.create({
      data: {
        name: createNoteCategoryDto.name,
        color: createNoteCategoryDto.color,
        userId: createNoteCategoryDto.userId,
      },
    });
  }

  findAll() {
    return this.prisma.noteCategory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        notes: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.noteCategory.findUnique({
      where: { id },
      include: {
        notes: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Note category with id ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateNoteCategoryDto: UpdateNoteCategoryDto) {
    await this.findOne(id);

    return this.prisma.noteCategory.update({
      where: { id },
      data: {
        name: updateNoteCategoryDto.name,
        color: updateNoteCategoryDto.color,
        userId: updateNoteCategoryDto.userId,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.noteCategory.delete({
      where: { id },
    });
  }
}
