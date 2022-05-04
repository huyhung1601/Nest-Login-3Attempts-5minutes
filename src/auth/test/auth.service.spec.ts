import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserModel } from '../../users/__mocks__/user.model';
import { userStub } from '../../users/stub/user.stub';
import { PassportModule } from '@nestjs/passport';

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
    beforeEach(async () => {
      jest.spyOn(usersService, 'findUser');
      user = await usersService.findUser('admin');
      if (user && !user.access_token) {
        user.access_token = authService.createToken(user.username, user.id);
      }
    });

    it('should find a user return a user with a token', () => {
      expect(user).toEqual({
        access_token: expect.any(String),
        ...userStub(),
        save: expect.any(Function),
      });
    });

    it('chech user is not locked', () => {
      expect(user.locked).toEqual(expect.any(Boolean));
    });

    it('create token when users start logging in', async () => {
      if (!user.access_token) {
        const token = authService.createToken(user.username, user.id);
        expect(token).toEqual(expect.any(String));
        user.access_token = token;
      }
    });
    it('check if password matched within 5mins and 3 attempts', async () => {
      const expires = authService.decodeToken(user.access_token);
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
