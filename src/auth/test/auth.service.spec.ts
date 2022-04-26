import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { UsersModule } from '../../users/users.module';
import mongoose from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let user: any;

  const mockuser = { username: 'admin', password: 'admin' };

  const mockUsersModel = {
    findOne: jest.fn().mockResolvedValue({
      id: 'id',
      username: 'admin',
      password: 'admin',
      locked: false,
      attempts: 0,
    }),
  };

  const mockAuthService = {
    createToken: jest.fn().mockReturnValue({ access_token: 'payload' }),
    decodeToken: jest
      .fn()
      .mockReturnValue({ expires: new Date().getTime() / 1000 + 60 }),
    validateUser: jest
      .fn()
      .mockResolvedValue({ id: new Date().toString(), ...({} as User) }),
    login: jest.fn().mockResolvedValue({ access_token: 'access_token' }),
    user: {
      save: jest
        .fn()
        .mockResolvedValue({ id: new Date().toString(), ...({} as User) }),
    },
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'SECRET',
          signOptions: { expiresIn: 60 * 5 },
        }),
      ],
      providers: [AuthService, { provide: UsersService, useValue: {} }],
    })
      .overrideProvider(getModelToken('User'))
      .useValue(mockUsersModel)
      .compile();

    beforeEach(function (done) {
      const conn = mongoose.createConnection();
    });

    userService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);

    user = await userService.findUser('admin');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('chech user is not locked', () => {
      expect(user.locked).toEqual(false);
    });
    it('create token when users start logging in', async () => {
      if (!user.access_token) {
        expect(authService.createToken(user.username, user.id)).toEqual<string>(
          expect.any(String),
        );
        expect(await user.save()).toEqual({
          id: expect.any(String),
          ...({} as User),
        });
      }
    });
    it('return userInfo if password matched within 5mins and 3 attempts', async () => {
      const expires = authService.decodeToken(user.access_token);
      expect(expires).toEqual({ expires: expect.any(Number) });
      const timeleft = Math.floor(expires - new Date().getTime() / 1000);

      user &&
        !user.locked &&
        user.password === mockuser.password &&
        timeleft > 0 &&
        expect(
          await authService.validateUser(mockuser.username, mockuser.password),
        ).toEqual({
          id: expect.any(String),
          ...({} as User),
        });
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      expect(
        await authService.login(mockuser.username, mockuser.password),
      ).toEqual({
        access_token: 'access_token',
      });
    });
  });
});
