import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { CheckHabitDto } from './dto/check-habit.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  create(@Body() createHabitDto: CreateHabitDto) {
    return this.habitsService.create(createHabitDto);
  }

  @Get()
  findAll() {
    return this.habitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.habitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitDto: UpdateHabitDto) {
    return this.habitsService.update(+id, updateHabitDto);
  }

  @Post(':id/check')
  checkHabit(@Param('id') id: string, @Body() checkHabitDto: CheckHabitDto) {
    return this.habitsService.checkHabit(+id, checkHabitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitsService.remove(+id);
  }
}
