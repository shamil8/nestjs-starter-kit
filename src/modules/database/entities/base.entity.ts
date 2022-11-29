import { Column, PrimaryColumn } from 'typeorm';
import { getUUID } from '@app/crypto-utils/functions/export-settings';

export abstract class BaseEntity {
  @PrimaryColumn()
  id: string = getUUID();

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt?: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  updatedAt?: string;
}
