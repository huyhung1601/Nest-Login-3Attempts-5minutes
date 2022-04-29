import { UserModel } from '../../users/__mocks__/user.model';
import { userStub } from '../../users/stub/user.stub';

interface Constructor<T> {
  new (): T;
}

export class MockModel<T> {
  public entity: any;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData): void {}

  findOne(): { exec: () => any } {
    return {
      exec: (): any => new UserModel(this.entity),
    };
  }

  async exec() {
    return new UserModel(this.entity);
  }

  async save() {
    return new UserModel(this.entity);
  }
}
