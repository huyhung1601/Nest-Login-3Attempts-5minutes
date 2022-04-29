import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.model';
import { getModelToken } from '@nestjs/mongoose';
import { MockUser, UserModel } from '../../users/__mocks__/user.model';
import { MockModel } from '../../database/test/mock.model';
import { userStub } from '../../users/stub/user.stub';
import { PassportModule } from '@nestjs/passport';
import { stringify } from 'querystring';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let user: any;

  const mockuser = { username: 'admin', password: 'admin' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'SECRET',
          signOptions: { expiresIn: 60 * 5 },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        { provide: getModelToken('User'), useClass: UserModel },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    let entity: UserModel['entity'];
    beforeEach(async () => {
      jest.spyOn(usersService, 'findUser');
      user = await usersService.findUser('admin');
      entity = user.entity;
      if (user && !user.access_token) {
        entity.access_token = authService.createToken(
          entity.username,
          entity.id,
        );
      }
    });

    it('should find a user return a user', () => {
      expect(entity).toEqual({
        access_token: expect.any(String),
        ...userStub(),
      });
    });

    it('chech user is not locked', () => {
      expect(entity.locked).toEqual(expect.any(Boolean));
    });

    it('create token when users start logging in', async () => {
      if (!entity.access_token) {
        const token = authService.createToken(entity.username, entity.id);
        expect(token).toEqual(expect.any(String));
        entity.access_token = token;
        await user.save();
      }
    });
    it('check if password matched within 5mins and 3 attempts', async () => {
      const expires = authService.decodeToken(entity.access_token);
      expect(expires).toEqual(expect.any(Number));
      const timeleft = Math.floor(expires - new Date().getTime() / 1000);

      expect(timeleft > 0);
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      expect(
        await authService.login(mockuser.username, mockuser.password),
      ).toEqual({
        access_token: undefined,
      });
    });
  });
});
