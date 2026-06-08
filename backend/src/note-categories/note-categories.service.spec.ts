import { Test, TestingModule } from '@nestjs/testing';
import { NoteCategoriesService } from './note-categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../test/prisma.mock';

describe('NoteCategoriesService', () => {
  let service: NoteCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteCategoriesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<NoteCategoriesService>(NoteCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
