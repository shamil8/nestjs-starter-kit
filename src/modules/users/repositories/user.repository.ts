import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Page } from '@app/crypto-utils/repositories/page';

import { UserEntity } from '../entities/user.entity';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async list(query: UserListQuery): Promise<UserEntity[]> {
    const page = new Page(query.page, query.take);

    return await this.userRepository.find({
      where: {
        name: query.text && ILike(`%${query.text}%`),
      },
      take: page.limit || undefined,
      skip: page.offset,
    });
  }

  async store(userCommand: StoreUserCommand): Promise<UserEntity> {
    return await this.userRepository.save(userCommand);
  }
}
