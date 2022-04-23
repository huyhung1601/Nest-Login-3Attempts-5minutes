import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async findUser(username: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ username });
    return user;
  }
}
