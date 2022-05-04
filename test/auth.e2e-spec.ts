import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/users/user.model';
import { AuthController } from '../src/auth/auth.controller';
import { LocalStrategy } from '../src/auth/local.strategy';
import { getModelToken } from '@nestjs/mongoose';
import { UserModel } from '../src/users/__mocks__/user.model';
import { UsersService } from '../src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'SECRET',
          signOptions: { expiresIn: 60 * 5 },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        LocalStrategy,
        { provide: getModelToken('User'), useClass: UserModel },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return access_token if login successfully', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin' })
      .expect(201);
  });
});
