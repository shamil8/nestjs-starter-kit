import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';

export class UserDto {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'User ID',
  })
  id!: number;

  @ApiProperty({ example: 'Shamil' })
  name!: string;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.name = entity.name;
  }
}
