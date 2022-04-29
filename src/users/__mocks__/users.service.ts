import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MockModel } from '../../database/test/mock.model';
import { User } from '../user.model';
import { MockUser, UserModel } from './user.model';

@Injectable()
export class MockUsersService {
  constructor(
    @InjectModel('User') public readonly userModel: MockModel<MockUser>,
  ) {}

  async findUser(username: string): Promise<UserModel | undefined> {
    const user = await this.userModel.findOne().exec();
    return user;
  }
}
