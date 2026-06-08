import { Test, TestingModule } from '@nestjs/testing';
import { FinancesService } from './finances.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../test/prisma.mock';

describe('FinancesService', () => {
  let service: FinancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<FinancesService>(FinancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
