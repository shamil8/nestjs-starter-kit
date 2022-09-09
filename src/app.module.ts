import { Module } from '@nestjs/common';

import { DatabaseModule } from './modules/database/database.module';
import { RabbitModule } from './modules/rabbit/rabbit.module';
import { UserModule } from './modules/users/user.module';
import { Web3Module } from './modules/web3/web3.module';

@Module({
  imports: [DatabaseModule, RabbitModule, Web3Module, UserModule],
})
export class AppModule {}
