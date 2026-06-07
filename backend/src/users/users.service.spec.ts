import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a new user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, email: 'user@life.app' });

    const result = await service.create({
      email: 'user@life.app',
      password: 'securepass',
      fullName: 'Usuario',
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'user@life.app' } });
    expect(prisma.user.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, email: 'user@life.app' });
  });

  it('should reject duplicate email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'user@life.app' });

    await expect(
      service.create({
        email: 'user@life.app',
        password: 'securepass',
        fullName: 'Usuario',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
