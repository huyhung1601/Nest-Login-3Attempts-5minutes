import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../users/user.model';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { UsersModule } from '../../users/users.module';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ id: 'id', ...({} as User) }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'SECRET',
          signOptions: { expiresIn: 60 * 5 },
        }),
      ],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideProvider(getModelToken('User'))
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return userInfo', async () => {
      expect(await controller.login('admin', 'admin')).toEqual({
        id: expect.any(String),
        ...({} as User),
      });
    });
  });
});
