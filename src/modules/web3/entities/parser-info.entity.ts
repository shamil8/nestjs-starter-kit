import { Entity, PrimaryColumn, Column } from 'typeorm';

import { Network } from '../enums/network';
import { generatePkName } from '../../database/utils/generate-constraint';

const tableName = 'parser_infos';

@Entity({ name: tableName })
export class ParserInfoEntity {
  @PrimaryColumn({
    ...generatePkName(tableName, 'address', 'net'),
    type: 'varchar',
  })
  address!: string;

  @PrimaryColumn({
    ...generatePkName(tableName, 'address', 'net'),
    type: 'varchar',
  })
  net!: Network;

  @Column({ type: 'numeric', nullable: false, width: 35, default: '0' })
  lastBlock = '0';
}
