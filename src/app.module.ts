import { Module } from '@nestjs/common';

import { LoggerModule } from './modules/logger/logger.module';
import { DatabaseModule } from './modules/database/database.module';
import { RabbitModule } from './modules/rabbit/rabbit.module';
import { UserModule } from './modules/users/user.module';
import { Web3Module } from './modules/web3/web3.module';
import { Erc20Module } from './modules/erc20/erc20.module';

@Module({
  imports: [
    /** Logger module */
    LoggerModule,

    /** Database module */
    DatabaseModule,

    /** RabbitMQ module */
    RabbitModule,

    /** Application modules */
    UserModule,

    /** Blockchain modules */
    Web3Module,

    /** Blockchain contract modules */
    Erc20Module,
  ],
})
export class AppModule {}
