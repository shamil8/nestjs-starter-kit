import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1661154344397 implements MigrationInterface {
  name = 'create-user1661154344397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Create users schema and table */
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "users";`);
    await queryRunner.query(
      `CREATE TABLE "users"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(55) NOT NULL, "is_available" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"."users"`);
    await queryRunner.query(`DROP SCHEMA "users" CASCADE;`);
  }
}
