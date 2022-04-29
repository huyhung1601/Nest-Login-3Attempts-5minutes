import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { userStub } from '../stub/user.stub';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { MockUser, UserModel } from '../__mocks__/user.model';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: UserModel;
  let userFilterQuery: FilterQuery<MockUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useClass: UserModel,
        },
      ],
    }).compile();

    userModel = module.get<UserModel>(getModelToken('User'));
    usersService = module.get<UsersService>(UsersService);
    userFilterQuery = {
      username: 'admin',
    };

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(UsersService).toBeDefined();
  });

  describe('findUser', () => {
    let user: any;
    beforeEach(async () => {
      jest.spyOn(userModel, 'findOne');
      user = await usersService.userModel.findOne(userFilterQuery).exec();
    });

    test('then it should call the userModel', () => {
      expect(userModel.findOne).toHaveBeenCalledWith(userFilterQuery);
    });

    test('then it should return a user', () => {
      expect(user).toEqual({
        entity: {
          attempts: 0,
          id: 'id1',
          locked: false,
          password: 'admin',
          username: 'admin',
        },
      });
    });
  });
});
