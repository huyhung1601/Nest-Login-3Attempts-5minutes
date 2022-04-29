import { Module } from '@nestjs/common';
import { MockModel } from 'src/database/test/mock.model';
import { MockUsersService } from './users.service';

@Module({
  imports: [MockUsersModule],
  providers: [MockUsersService],
  exports: [MockUsersService],
})
export class MockUsersModule {}
