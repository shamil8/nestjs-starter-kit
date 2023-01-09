import { getNANOID } from '@app/crypto-utils/functions/export-settings';
import { Column, DeleteDateColumn, PrimaryColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryColumn()
  id: string = getNANOID();

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt?: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  updatedAt?: string;

  @DeleteDateColumn({ default: null })
  deletedAt?: Date | null;
}
