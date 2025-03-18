import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1742291776867 implements MigrationInterface {
    name = 'SeedInitialData1742291776867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "industry" character varying`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "keywords" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "symbol" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "keywords" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "industry" character varying`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "symbol" character varying NOT NULL`);
    }

}
