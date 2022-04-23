import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username);

    if (user.locked) {
      return false;
    }

    //create token when users start logging in
    if (!user.access_token) {
      const access_token = this.createToken(user.username, user.id);
      user.access_token = access_token;
      await user.save();
    }

    //check 3 attempts within 5 minutes
    const expires = this.decodeToken(user.access_token);
    const timeleft = expires - Math.floor(new Date().getTime() / 1000); // seconds;

    if (user.password !== password) {
      user.attempts += 1;
      user.locked = user.attempts === 3 || timeleft < 0 ? true : false;
      await user.save();
    }

    if (user && !user.locked && timeleft > 0 && user.password === password) {
      //refresh token
      const newToken = this.createToken(user.username, user.id);
      user.access_token = newToken;
      user.attempts = 0;
      user.locked = false;
      await user.save();
      return user;
    }

    return null;
  }

  async login(username, password) {
    const { access_token } = await this.userService.findUser(username);
    return { access_token };
  }

  private createToken(username, id) {
    const payload = { name: username, sub: id };
    return this.jwtService.sign(payload);
  }

  private decodeToken(token) {
    const decodedJwtAccessToken: any = this.jwtService.decode(token);
    return decodedJwtAccessToken.exp;
  }
}
