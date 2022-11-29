import { Column } from 'typeorm';

export abstract class BaseEntity {
  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt?: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  updatedAt?: string;
}
