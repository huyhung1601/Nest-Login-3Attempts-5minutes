import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { userStub } from '../stub/user.stub';
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
      user = await usersService.findUser('admin');
    });

    test('then it should call the userModel', () => {
      expect(usersService.userModel.findOne).toHaveBeenCalledWith(
        userFilterQuery,
      );
    });

    test('then it should return a user', () => {
      expect(user).toEqual({
        ...userStub(),
        save: expect.any(Function),
      });
    });
  });
});
