import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') public readonly userModel: Model<User>) {}

  async findUser(userName: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ userName });
    return user;
  }
}
