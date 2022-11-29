import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
} from 'typeorm';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { getUUID } from '@app/crypto-utils/functions/export-settings';

import { BaseEntity } from '../../database/entities/base.entity';
import { UserRole } from '../enums/user-role';
import { generatePkName } from '../../database/utils/generate-constraint';

const tableName = 'users';

@Entity({ schema: 'users', name: tableName })
export class UserEntity extends BaseEntity {
  @PrimaryColumn(generatePkName(tableName))
  id: string = getUUID();

  @Column()
  email!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ length: 55 })
  role!: UserRole;

  @Column({
    select: false,
  })
  password!: string;

  @BeforeInsert()
  @BeforeUpdate()
  private encryptPassword(): void {
    if (!this.password) {
      return;
    }

    const salt = genSaltSync(10);

    this.password = hashSync(this.password, salt);
  }

  passwordCompare(password: string): boolean {
    return compareSync(password, this.password.replace(/^\$2y/, '$2a'));
  }
}
