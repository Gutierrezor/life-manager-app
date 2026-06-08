import { Test, TestingModule } from '@nestjs/testing';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

describe('HabitsController', () => {
  let controller: HabitsController;

  const mockHabitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    checkHabit: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitsController],
      providers: [
        {
          provide: HabitsService,
          useValue: mockHabitsService,
        },
      ],
    }).compile();

    controller = module.get<HabitsController>(HabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
