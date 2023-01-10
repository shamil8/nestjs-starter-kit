import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

// Declaration Merging Of Module.
declare module 'typeorm/query-builder/SelectQueryBuilder' {
  interface SelectQueryBuilder<Entity> {
    AndDateRange(
      this: SelectQueryBuilder<Entity>,
      startDate?: Date,
      endDate?: Date,
    ): SelectQueryBuilder<Entity>;
    AndAmountRange(
      this: SelectQueryBuilder<Entity>,
      amountFrom?: number,
      amountTo?: number,
      ALIAS?: string,
    ): SelectQueryBuilder<Entity>;
    AndSearch(
      this: SelectQueryBuilder<Entity>,
      fields: string[],
      text?: string,
    ): SelectQueryBuilder<Entity>;
    AndIN(
      this: SelectQueryBuilder<Entity>,
      columnName: string,
      values: string[],
    ): SelectQueryBuilder<Entity>;
    AndStatus(
      this: SelectQueryBuilder<Entity>,
      status?: string,
    ): SelectQueryBuilder<Entity>;
    // CustomInnerJoinAndSelect(
    //   this: SelectQueryBuilder<Entity>,
    //   ALIAS,
    //   RELATIONS: string[],
    // ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.AndIN = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  columnName: string,
  values: string[],
): SelectQueryBuilder<Entity> {
  if (values.length > 0) {
    this.andWhere(`${this.alias}.${columnName} IN (:...values)`, { values });
  }

  return this;
};

/**
 * Get Date Range Selection (Add Where Conditions).
 *
 * @param startDate
 * @param endDate
 * @constructor
 */
SelectQueryBuilder.prototype.AndDateRange = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  startDate?: Date,
  endDate?: Date,
): SelectQueryBuilder<Entity> {
  if (startDate || endDate) {
    this.andWhere(`${this.alias}.created_at BETWEEN :startDate AND :endDate`, {
      startDate: new Date(startDate || 0).toISOString(),
      endDate: (endDate ? new Date(endDate) : new Date()).toISOString(),
    });
  }

  return this;
};

/**
 * Check status if exist will set to query addWhere
 *
 * @param status
 * @constructor
 */
SelectQueryBuilder.prototype.AndStatus = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  status?: string,
): SelectQueryBuilder<Entity> {
  if (status) {
    this.andWhere(`${this.alias}.status = :status`, { status });
  }

  return this;
};

/**
 * Get text by multiply fields
 *
 * @constructor
 * @param fields
 * @param text
 */
SelectQueryBuilder.prototype.AndSearch = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  fields: string[],
  text?: string,
): SelectQueryBuilder<Entity> {
  if (text) {
    const formattedQuery = text.trim().replace(/ /g, ' & ');

    fields.forEach((field, index) => {
      this[index === 0 ? 'andWhere' : 'orWhere'](
        `to_tsvector('simple', ${field}) @@ to_tsquery('simple', :text)`,
        { text: `${formattedQuery}:*` },
      );
    });
  }

  return this;
};

/**
 * Get Amount Range Selection (Add Where Conditions).
 *
 * @constructor
 * @param amountFrom
 * @param amountTo
 * @param queryAlias
 */
SelectQueryBuilder.prototype.AndAmountRange = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  amountFrom?: number,
  amountTo?: number,
  queryAlias?: string,
): SelectQueryBuilder<Entity> {
  const alias = queryAlias || this.alias;

  if (amountFrom) {
    this.andWhere(`${alias}.amount::NUMERIC >= (:amountFrom)::NUMERIC`, {
      amountFrom,
    });
  }

  if (amountTo) {
    this.andWhere(`${alias}.amount::NUMERIC <= (:amountTo)::NUMERIC`, {
      amountTo,
    });
  }

  return this;
};

// // InnerJoinAndSelect For Joining Multiple Relations Of Sub Alias.
// SelectQueryBuilder.prototype.CustomInnerJoinAndSelect = function <Entity>(
//   this: SelectQueryBuilder<Entity>,
//   ALIAS,
//   RELATIONS: string[],
// ): SelectQueryBuilder<Entity> {
//   return RELATIONS.reduce((acc: any, item: any): any => {
//     acc = acc.innerJoinAndSelect(`${ALIAS}.${item}`, `${item}`);
//     return acc;
//   }, this);
// };
