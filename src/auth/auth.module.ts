import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: 60 * 5 },
    }),
  ],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
