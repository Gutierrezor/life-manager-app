import { Test, TestingModule } from '@nestjs/testing';
import { NoteCategoriesController } from './note-categories.controller';
import { NoteCategoriesService } from './note-categories.service';

describe('NoteCategoriesController', () => {
  let controller: NoteCategoriesController;

  const mockNoteCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteCategoriesController],
      providers: [
        {
          provide: NoteCategoriesService,
          useValue: mockNoteCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<NoteCategoriesController>(NoteCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
