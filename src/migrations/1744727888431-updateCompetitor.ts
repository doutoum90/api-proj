import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCompetitor1744727888431 implements MigrationInterface {
    name = 'UpdateCompetitor1744727888431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competitor_data_source" DROP CONSTRAINT "FK_599b12262b813991a940398e476"`);
        await queryRunner.query(`ALTER TYPE "public"."competitor_data_source_type_enum" RENAME TO "competitor_data_source_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."competitor_data_source_type_enum" AS ENUM('TRENDS', 'GOOGLE_TRENDS', 'MARKET_SHARE', 'SEMRUSH', 'PRICE', 'FINANCIAL')`);
        await queryRunner.query(`ALTER TABLE "competitor_data_source" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "competitor_data_source" ALTER COLUMN "type" TYPE "public"."competitor_data_source_type_enum" USING "type"::"text"::"public"."competitor_data_source_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."competitor_data_source_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "competitor_data_source" ADD CONSTRAINT "FK_599b12262b813991a940398e476" FOREIGN KEY ("competitorId") REFERENCES "competitor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "competitor_data_source" DROP CONSTRAINT "FK_599b12262b813991a940398e476"`);
        await queryRunner.query(`CREATE TYPE "public"."competitor_data_source_type_enum_old" AS ENUM('website', 'social_media', 'news', 'blog', 'rss', 'api', 'scraping')`);
        await queryRunner.query(`ALTER TABLE "competitor_data_source" ALTER COLUMN "type" TYPE "public"."competitor_data_source_type_enum_old" USING "type"::"text"::"public"."competitor_data_source_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "competitor_data_source" ALTER COLUMN "type" SET DEFAULT 'website'`);
        await queryRunner.query(`DROP TYPE "public"."competitor_data_source_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."competitor_data_source_type_enum_old" RENAME TO "competitor_data_source_type_enum"`);
        await queryRunner.query(`ALTER TABLE "competitor_data_source" ADD CONSTRAINT "FK_599b12262b813991a940398e476" FOREIGN KEY ("competitorId") REFERENCES "competitor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
