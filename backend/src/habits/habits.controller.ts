import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CheckHabitDto } from './dto/check-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body() createHabitDto: CreateHabitDto, @Req() request: AuthenticatedRequest) {
    return this.habitsService.create(createHabitDto, request.user.id);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.habitsService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.habitsService.findOne(+id, request.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto, @Req() request: AuthenticatedRequest) {
    return this.habitsService.update(+id, updateHabitDto, request.user.id);
  }

  @Post(':id/check')
  checkHabit(@Param('id') id: string, @Body() checkHabitDto: CheckHabitDto, @Req() request: AuthenticatedRequest) {
    return this.habitsService.checkHabit(+id, checkHabitDto, request.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.habitsService.remove(+id, request.user.id);
  }
}
