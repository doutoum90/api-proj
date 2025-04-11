import { MigrationInterface, QueryRunner } from "typeorm";

export class IntitialeCreate1744295560660 implements MigrationInterface {
    name = 'IntitialeCreate1744295560660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_typeabonnement_enum" AS ENUM('Essentiel', 'PRO', 'Expert')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, "name" character varying, "lastname" character varying, "dateOfBirth" character varying, "profession" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "typeAbonnement" "public"."user_typeabonnement_enum" NOT NULL DEFAULT 'Essentiel', "trialStartDate" TIMESTAMP, "trialActive" boolean NOT NULL DEFAULT true, "avatar" character varying, "stripeCustomerId" character varying, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_0bfe583759eb0305b60117be840" UNIQUE ("stripeCustomerId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "type" character varying NOT NULL, "url" character varying NOT NULL, "image" character varying NOT NULL, "pdf" character varying NOT NULL, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "planId" character varying NOT NULL, "amount" integer NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "competitor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "kpis" jsonb NOT NULL, CONSTRAINT "PK_6149e19778629247a7a7984e163" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "news" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trends" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_4de18eea43d948e5ea66520e0e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "market_trend" ("id" SERIAL NOT NULL, "keyword" character varying NOT NULL, "trendScore" integer NOT NULL, "period" character varying NOT NULL, "region" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "trendData" jsonb NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4bf8360dd43b4d08b73e0e53ef2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "market_share" ("id" SERIAL NOT NULL, "competitor" character varying NOT NULL, "sharePercentage" double precision NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_06a822e7658bab3e230e0af89fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "market_price" ("id" SERIAL NOT NULL, "product" character varying NOT NULL, "price" double precision NOT NULL, "period" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d0e67fad606926d3f44a79bab5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "setting" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regulation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "status" character varying NOT NULL, "department" character varying NOT NULL, "effectiveDate" TIMESTAMP NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_0ce8c4819fd1a67eb46f6bb0fe3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alert" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "severity" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "regulation" character varying NOT NULL, CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "kpis"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "kpis" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "symbol" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "industry" character varying`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "keywords" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
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
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "keywords"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "industry"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "symbol"`);
        await queryRunner.query(`ALTER TABLE "competitor" DROP COLUMN "kpis"`);
        await queryRunner.query(`ALTER TABLE "competitor" ADD "kpis" jsonb NOT NULL`);
        await queryRunner.query(`DROP TABLE "alert"`);
        await queryRunner.query(`DROP TABLE "regulation"`);
        await queryRunner.query(`DROP TABLE "contact"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "market_price"`);
        await queryRunner.query(`DROP TABLE "market_share"`);
        await queryRunner.query(`DROP TABLE "market_trend"`);
        await queryRunner.query(`DROP TABLE "trends"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TABLE "competitor"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_typeabonnement_enum"`);
    }

}
