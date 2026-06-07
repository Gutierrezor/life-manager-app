import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { NoteCategoriesService } from './note-categories.service';
import { CreateNoteCategoryDto } from './dto/create-note-category.dto';
import { UpdateNoteCategoryDto } from './dto/update-note-category.dto';

@Controller('note-categories')
export class NoteCategoriesController {
  constructor(private readonly noteCategoriesService: NoteCategoriesService) {}

  @Post()
  create(@Body() createNoteCategoryDto: CreateNoteCategoryDto) {
    return this.noteCategoriesService.create(createNoteCategoryDto);
  }

  @Get()
  findAll() {
    return this.noteCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteCategoryDto: UpdateNoteCategoryDto,
  ) {
    return this.noteCategoriesService.update(+id, updateNoteCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteCategoriesService.remove(+id);
  }
}
