import { Test, TestingModule } from '@nestjs/testing';
import { CalendarEventsService } from './calendar-events.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../test/prisma.mock';

describe('CalendarEventsService', () => {
  let service: CalendarEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarEventsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CalendarEventsService>(CalendarEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
