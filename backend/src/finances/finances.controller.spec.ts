import { Test, TestingModule } from '@nestjs/testing';
import { FinancesController } from './finances.controller';
import { FinancesService } from './finances.service';

describe('FinancesController', () => {
  let controller: FinancesController;

  const mockFinancesService = {
    createCategory: jest.fn(),
    findAllCategories: jest.fn(),
    createTransaction: jest.fn(),
    findAllTransactions: jest.fn(),
    findOneTransaction: jest.fn(),
    removeTransaction: jest.fn(),
    getSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancesController],
      providers: [
        {
          provide: FinancesService,
          useValue: mockFinancesService,
        },
      ],
    }).compile();

    controller = module.get<FinancesController>(FinancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
