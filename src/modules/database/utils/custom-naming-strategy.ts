import { Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class CustomNamingStrategy extends SnakeNamingStrategy {
  primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    let [, tableName] = tableOrName.split('.');

    if (!tableName) {
      tableName = tableOrName;
    }

    return `pk_${tableName}__${columnNames.join('_')}`;
  }

  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    let columns = columnNames.join('_');
    let [, tableName] = tableOrName.split('.');

    if (!tableName) {
      tableName = tableOrName;
    }

    if (referencedTablePath) {
      tableName = `${tableName}__${referencedTablePath}`;
    }

    if (referencedColumnNames && referencedColumnNames.length) {
      columns = `${columns}__${referencedColumnNames.join('_')}`;
    }

    return `fk_${tableName}__${columns}`;
  }
}
