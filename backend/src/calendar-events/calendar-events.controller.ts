import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { CalendarEventsService } from './calendar-events.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';

@Controller('calendar-events')
export class CalendarEventsController {
  constructor(private readonly calendarEventsService: CalendarEventsService) {}

  @Post()
  create(@Body() createCalendarEventDto: CreateCalendarEventDto, @Req() request: AuthenticatedRequest) {
    return this.calendarEventsService.create(createCalendarEventDto, request.user.id);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.calendarEventsService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.calendarEventsService.findOne(+id, request.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCalendarEventDto: UpdateCalendarEventDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.calendarEventsService.update(+id, updateCalendarEventDto, request.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.calendarEventsService.remove(+id, request.user.id);
  }
}
