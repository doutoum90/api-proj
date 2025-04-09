import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStripeCustomerIdToUser1744193018043 implements MigrationInterface {
    name = 'AddStripeCustomerIdToUser1744193018043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "kpis"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "kpis" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "industry" character varying`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "keywords" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "symbol" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP CONSTRAINT "PK_6149e19778629247a7a7984e163"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD CONSTRAINT "PK_6149e19778629247a7a7984e163" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competitor" DROP CONSTRAINT "PK_6149e19778629247a7a7984e163"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD CONSTRAINT "PK_6149e19778629247a7a7984e163" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "kpis"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "kpis" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "keywords" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "industry" character varying`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "symbol" character varying NOT NULL`);
    }

}
