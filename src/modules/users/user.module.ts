import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    // repositories
    UserRepository,

    // services
    UserService,
  ],
})
export class UserModule {}
