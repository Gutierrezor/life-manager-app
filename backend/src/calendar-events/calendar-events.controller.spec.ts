import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventsService } from './calendar-events.service';

describe('CalendarEventsController', () => {
  let controller: CalendarEventsController;

  const mockCalendarEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarEventsController],
      providers: [
        {
          provide: CalendarEventsService,
          useValue: mockCalendarEventsService,
        },
      ],
    }).compile();

    controller = module.get<CalendarEventsController>(CalendarEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
