import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { NoteCategoriesService } from './note-categories.service';
import { CreateNoteCategoryDto } from './dto/create-note-category.dto';
import { UpdateNoteCategoryDto } from './dto/update-note-category.dto';

@Controller('note-categories')
export class NoteCategoriesController {
  constructor(private readonly noteCategoriesService: NoteCategoriesService) {}

  @Post()
  create(@Body() createNoteCategoryDto: CreateNoteCategoryDto, @Req() request: AuthenticatedRequest) {
    return this.noteCategoriesService.create(createNoteCategoryDto, request.user.id);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.noteCategoriesService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.noteCategoriesService.findOne(+id, request.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteCategoryDto: UpdateNoteCategoryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.noteCategoriesService.update(+id, updateNoteCategoryDto, request.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.noteCategoriesService.remove(+id, request.user.id);
  }
}
