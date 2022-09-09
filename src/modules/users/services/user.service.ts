import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repositories/user.repository';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserDto } from '../dto/resource/user.dto';
import { UserListQuery } from '../dto/query/user-list.query';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(query: UserListQuery): Promise<UserDto[]> {
    const users = await this.userRepository.list(query);

    return users.map((user) => new UserDto(user));
  }

  async createUser(command: StoreUserCommand): Promise<UserDto> {
    const user = await this.userRepository.store(command);

    return new UserDto(user);
  }
}
