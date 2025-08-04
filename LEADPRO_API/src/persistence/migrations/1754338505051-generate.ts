import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1754338505051 implements MigrationInterface {
    name = 'Generate1754338505051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`menu_group\` \`groups\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`action\` ADD \`groups\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`groups\``);
        await queryRunner.query(`ALTER TABLE \`menu\` ADD \`groups\` text NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e3f27529ac3d5b49ce85938917\` ON \`action\` (\`url\`, \`menu_id\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e3f27529ac3d5b49ce85938917\` ON \`action\``);
        await queryRunner.query(`ALTER TABLE \`menu\` DROP COLUMN \`groups\``);
        await queryRunner.query(`ALTER TABLE \`menu\` ADD \`groups\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`action\` DROP COLUMN \`groups\``);
        await queryRunner.query(`ALTER TABLE \`menu\` CHANGE \`groups\` \`menu_group\` int NOT NULL DEFAULT '1'`);
    }

}
