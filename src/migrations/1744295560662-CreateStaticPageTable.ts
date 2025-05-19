import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStaticPageTable1744295560662 implements MigrationInterface {
    name = 'CreateStaticPageTable1744295560662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "static_page" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "slug" character varying NOT NULL,
                "title" character varying NOT NULL,
                "content" text NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_static_page_slug" UNIQUE ("slug"),
                CONSTRAINT "PK_static_page_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "static_page"`);
    }
} 