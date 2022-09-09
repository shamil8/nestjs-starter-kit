import { MigrationInterface, QueryRunner } from 'typeorm';

export class parserInfo1662717158190 implements MigrationInterface {
  name = 'parser-info1662717158190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "parser_infos" ("address" character varying NOT NULL, "net" character varying NOT NULL, "last_block" numeric NOT NULL DEFAULT '0', CONSTRAINT "PK_ad6f6246f1d4f7682ddc6f14a69" PRIMARY KEY ("address", "net"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "parser_infos"`);
  }
}
