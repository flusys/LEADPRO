import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1753048835046 implements MigrationInterface {
    name = 'Generate1753048835046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_personal_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`father_name\` varchar(255) NULL, \`mother_name\` varchar(255) NULL, \`marital_status\` varchar(255) NULL, \`present_address\` text NULL, \`permanent_address\` text NULL, \`profession\` varchar(255) NULL, \`nominee_name\` varchar(255) NULL, \`relation_with_nominee\` varchar(255) NULL, \`comments\` text NULL, \`created_by\` int NULL, \`updated_by\` int NULL, \`deleted_by\` int NULL, \`user_id\` int NOT NULL, \`nid_photo_id\` int NULL, \`nominee_nid_photo_id\` int NULL, \`refer_user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_caa41b91f3c30a0f0a172187d9d\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_331edc6c04733098c74e3b39f81\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_316d2ef1146129a4d233863f823\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_26f4189498c6b038bfc624953c2\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_d39fdb10b9b1371666605df2a35\` FOREIGN KEY (\`nid_photo_id\`) REFERENCES \`gallery\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_961f12b246483a48d837dbbd557\` FOREIGN KEY (\`nominee_nid_photo_id\`) REFERENCES \`gallery\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` ADD CONSTRAINT \`FK_a23f383a4aaf0f6ec1c3ff64fe8\` FOREIGN KEY (\`refer_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_a23f383a4aaf0f6ec1c3ff64fe8\``);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_961f12b246483a48d837dbbd557\``);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_d39fdb10b9b1371666605df2a35\``);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_26f4189498c6b038bfc624953c2\``);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_316d2ef1146129a4d233863f823\``);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_331edc6c04733098c74e3b39f81\``);
        await queryRunner.query(`ALTER TABLE \`user_personal_info\` DROP FOREIGN KEY \`FK_caa41b91f3c30a0f0a172187d9d\``);
        await queryRunner.query(`DROP TABLE \`user_personal_info\``);
    }

}
