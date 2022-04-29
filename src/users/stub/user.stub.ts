import { MockUser } from '../__mocks__/user.model';

export const userStub = (): MockUser => {
  return {
    id: 'id1',
    username: 'admin',
    password: 'admin',
    locked: false,
    attempts: 0,
  };
};
