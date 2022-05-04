import { MockModel } from '../../database/test/mock.model';
import { userStub } from '../stub/user.stub';

export interface MockUser {
  id?: string;
  username: string;
  password: string;
  locked: boolean;
  access_token?: string;
  attempts: number;
}
export class UserModel extends MockModel<MockUser> {
  protected entity = userStub();
}
