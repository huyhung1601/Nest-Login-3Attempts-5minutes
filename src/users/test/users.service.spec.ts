import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user.model';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersModel = {
    findOne: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: new Date().toString(), ...({} as User) }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUsersModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUser', () => {
    it('should return object of user', async () => {
      expect(await service.findUser('admin')).toEqual({
        id: expect.any(String),
        ...({} as User),
      });
    });
  });
});
