export class MockModel<T> {
  protected entity: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData): void {}

  findOne() {
    const data = this.entity;
    return {
      exec: () => {
        return {
          ...data,
          save: () => this.save(data),
        };
      },
    };
  }

  save(data: T) {
    this.entity = data;
    return data;
  }
}
