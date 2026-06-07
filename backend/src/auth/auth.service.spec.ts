import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should validate user credentials', async () => {
    const hashedPassword = await bcrypt.hash('test1234', 10);
    (usersService.findOneByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'admin@life.app',
      password: hashedPassword,
    });

    const result = await authService.validateUser('admin@life.app', 'test1234');

    expect(result).toMatchObject({ id: 1, email: 'admin@life.app' });
    expect((result as any).password).toBeUndefined();
  });

  it('should return null for invalid credentials', async () => {
    (usersService.findOneByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'admin@life.app',
      password: await bcrypt.hash('test1234', 10),
    });

    const result = await authService.validateUser('admin@life.app', 'wrongpass');
    expect(result).toBeNull();
  });

  it('should return a signed access token', async () => {
    const token = await authService.login({ id: 1, email: 'admin@life.app' });
    expect(token).toEqual({ accessToken: 'fake-token' });
  });
});
