import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/user.model';
import { AuthController } from '../src/auth/auth.controller';
import { LocalStrategy } from '../src/auth/local.strategy';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockUserModel = {
    findOne: jest.fn().mockResolvedValue({ id: '', ...({} as User) }),
    save: jest.fn(),
  };

  const mockAuthService = {
    validateUser: jest
      .fn()
      .mockResolvedValue({ id: new Date().toString(), ...({} as User) }),
    login: jest.fn().mockResolvedValue({ access_token: 'access_token' }),
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        LocalStrategy,
      ],
    })
      .overrideProvider(getModelToken('User'))
      .useValue({ mockUserModel })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return access_token if login successfully', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(201)
      .expect({ access_token: 'access_token' });
  });
});
access_token: expect.any(String);
