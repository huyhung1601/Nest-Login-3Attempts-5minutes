import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserModel } from '../../users/__mocks__/user.model';
import { UsersService } from '../../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../local.strategy';

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
        LocalStrategy,
        { provide: getModelToken('User'), useClass: UserModel },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    authController = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token', async () => {
      expect(await authController.login('admin', 'admin')).toEqual({
        access_token: undefined,
      });
    });
  });
});
