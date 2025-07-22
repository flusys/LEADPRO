import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1753211269347 implements MigrationInterface {
    name = 'Generate1753211269347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`expense\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(200) NOT NULL, \`description\` text NULL, \`amount\` decimal(12,2) NOT NULL, \`type\` enum ('fixed', 'variable', 'one_time') NOT NULL DEFAULT 'variable', \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, \`deleted_by\` int NULL, \`recorded_by\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cash\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`amount\` decimal(12,2) NOT NULL, \`type\` enum ('credit', 'debit') NOT NULL, \`note\` text NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`deleted_by\` int NULL, \`cash_by\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_d7f0f7ca79854cf3b8a6eb0265f\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_e03ae853c8541a99221514c8ae7\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_76027b498dcb26ee7074c6858dc\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_249ef73eec456a37c899e369941\` FOREIGN KEY (\`recorded_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash\` ADD CONSTRAINT \`FK_8f84d7e2fe678cfe0698d5c6c7a\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash\` ADD CONSTRAINT \`FK_51811f839b26b081efe01f0935f\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash\` ADD CONSTRAINT \`FK_7563aade7bf3f1fd27584ea620b\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash\` ADD CONSTRAINT \`FK_badc477ee8c7f60784ffced5ccb\` FOREIGN KEY (\`cash_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cash\` DROP FOREIGN KEY \`FK_badc477ee8c7f60784ffced5ccb\``);
        await queryRunner.query(`ALTER TABLE \`cash\` DROP FOREIGN KEY \`FK_7563aade7bf3f1fd27584ea620b\``);
        await queryRunner.query(`ALTER TABLE \`cash\` DROP FOREIGN KEY \`FK_51811f839b26b081efe01f0935f\``);
        await queryRunner.query(`ALTER TABLE \`cash\` DROP FOREIGN KEY \`FK_8f84d7e2fe678cfe0698d5c6c7a\``);
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_249ef73eec456a37c899e369941\``);
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_76027b498dcb26ee7074c6858dc\``);
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_e03ae853c8541a99221514c8ae7\``);
        await queryRunner.query(`ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_d7f0f7ca79854cf3b8a6eb0265f\``);
        await queryRunner.query(`DROP TABLE \`cash\``);
        await queryRunner.query(`DROP TABLE \`expense\``);
    }

}
