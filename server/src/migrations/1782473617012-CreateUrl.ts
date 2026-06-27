import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrl1782473617012 implements MigrationInterface {
    name = 'CreateUrl1782473617012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "urls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "short_code" character varying(20) NOT NULL, "originalUrl" text NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "user_id" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP, CONSTRAINT "PK_eaf7bec915960b26aa4988d73b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e1d29d724dddebbdae878d3f49" ON "urls"  ("short_code") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e1d29d724dddebbdae878d3f49"`);
        await queryRunner.query(`DROP TABLE "urls"`);
    }

}
