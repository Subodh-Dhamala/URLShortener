import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUrl1782180102132 implements MigrationInterface {
    name = 'CreateUrl1782180102132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "urls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "short_code" character varying(20) NOT NULL, "originalUrl" text NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eaf7bec915960b26aa4988d73b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e1d29d724dddebbdae878d3f49" ON "urls"  ("short_code") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e1d29d724dddebbdae878d3f49"`);
        await queryRunner.query(`DROP TABLE "urls"`);
    }

}
