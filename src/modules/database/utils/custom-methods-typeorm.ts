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
      aliasWithColumn?: string,
    ): SelectQueryBuilder<Entity>;
    AndSearch(
      this: SelectQueryBuilder<Entity>,
      fields: string[],
      text?: string,
    ): SelectQueryBuilder<Entity>;
    AndIN(
      this: SelectQueryBuilder<Entity>,
      aliasWithColumn: string,
      values: string[],
    ): SelectQueryBuilder<Entity>;
    AndStatus(
      this: SelectQueryBuilder<Entity>,
      status?: string,
    ): SelectQueryBuilder<Entity>;
  }
}

SelectQueryBuilder.prototype.AndIN = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  aliasWithColumn: string,
  values: string[],
): SelectQueryBuilder<Entity> {
  if (values.length > 0) {
    this.andWhere(`${aliasWithColumn} IN (:...values)`, { values });
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
 * @param aliasWithColumn
 */
SelectQueryBuilder.prototype.AndAmountRange = function <Entity>(
  this: SelectQueryBuilder<Entity>,
  amountFrom?: number,
  amountTo?: number,
  aliasWithColumn?: string,
): SelectQueryBuilder<Entity> {
  aliasWithColumn = aliasWithColumn || `${this.alias}.amount`;

  if (amountFrom) {
    this.andWhere(`(${aliasWithColumn})::NUMERIC >= (:amountFrom)::NUMERIC`, {
      amountFrom,
    });
  }

  if (amountTo) {
    this.andWhere(`(${aliasWithColumn})::NUMERIC <= (:amountTo)::NUMERIC`, {
      amountTo,
    });
  }

  return this;
};
