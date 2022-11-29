/**
 * Generate primary key for constraint name
 * @param tableName - table name like user_wallets
 * @param columns - for example 'wallet_id' or 'wallet_id', 'merchant_id'
 */

export function generatePkName(
  tableName: string,
  ...columns: string[]
): { primaryKeyConstraintName: string } {
  if (!columns.length) {
    columns = ['id'];
  }

  return { primaryKeyConstraintName: `pk_${tableName}__${columns.join('_')}` };
}

/**
 * Generate foreign key for constraint name
 * @param tableName - table name like user_wallets
 * @param columns - for example 'wallet_id' or 'wallet_id', 'merchant_id'
 */
export function generateFkName(
  tableName: string,
  ...columns: string[]
): { foreignKeyConstraintName: string } {
  if (!columns.length) {
    const uniqName = new Date().getTime().toString();
    columns = [uniqName];
  }

  return { foreignKeyConstraintName: `fk_${tableName}__${columns.join('_')}` };
}
