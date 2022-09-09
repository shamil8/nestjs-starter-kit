import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'users', name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ length: 55 })
  name!: string;

  @Column({ type: 'boolean', default: true })
  isAvailable?: boolean;
}
