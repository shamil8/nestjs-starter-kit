import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class QueryRunnerService {
  constructor(private readonly dataSource: DataSource) {}

  async create(): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }

  async finish(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.commitTransaction();

    return queryRunner.release();
  }

  async rollback(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.rollbackTransaction();

    return queryRunner.release();
  }
}
