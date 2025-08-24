import { MigrationInterface, QueryRunner } from "typeorm";

export class Generate1756009552052 implements MigrationInterface {
    name = 'Generate1756009552052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`encryption_key\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`public_key\` text NULL, \`created_by\` varchar(36) NULL, \`updated_by\` varchar(36) NULL, \`deleted_by\` varchar(36) NULL, \`user_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`encryption_data\` (\`id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`stored_encryption_data\` text NULL, \`stored_iv\` text NULL, \`stored_encryption_aes_key\` text NULL, \`created_by\` varchar(36) NULL, \`updated_by\` varchar(36) NULL, \`deleted_by\` varchar(36) NULL, \`key_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` ADD CONSTRAINT \`FK_16b36fc427c397ff6f4b5556e32\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` ADD CONSTRAINT \`FK_74758295283264490d2b4131102\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` ADD CONSTRAINT \`FK_bfd6c71c4f4e346866cdb004ae5\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` ADD CONSTRAINT \`FK_47f17c13eaaf1af277381f34426\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` ADD CONSTRAINT \`FK_d56cbd4b7f1a54b423ceff4dbb9\` FOREIGN KEY (\`created_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` ADD CONSTRAINT \`FK_db70fdc8dc17669f16f8709bd34\` FOREIGN KEY (\`updated_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` ADD CONSTRAINT \`FK_5829cf889f80f1f690d2fd9a522\` FOREIGN KEY (\`deleted_by\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` ADD CONSTRAINT \`FK_1829cb37d0b1bbecb39838cf8c9\` FOREIGN KEY (\`key_id\`) REFERENCES \`encryption_key\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`encryption_data\` DROP FOREIGN KEY \`FK_1829cb37d0b1bbecb39838cf8c9\``);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` DROP FOREIGN KEY \`FK_5829cf889f80f1f690d2fd9a522\``);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` DROP FOREIGN KEY \`FK_db70fdc8dc17669f16f8709bd34\``);
        await queryRunner.query(`ALTER TABLE \`encryption_data\` DROP FOREIGN KEY \`FK_d56cbd4b7f1a54b423ceff4dbb9\``);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` DROP FOREIGN KEY \`FK_47f17c13eaaf1af277381f34426\``);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` DROP FOREIGN KEY \`FK_bfd6c71c4f4e346866cdb004ae5\``);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` DROP FOREIGN KEY \`FK_74758295283264490d2b4131102\``);
        await queryRunner.query(`ALTER TABLE \`encryption_key\` DROP FOREIGN KEY \`FK_16b36fc427c397ff6f4b5556e32\``);
        await queryRunner.query(`DROP TABLE \`encryption_data\``);
        await queryRunner.query(`DROP TABLE \`encryption_key\``);
    }

}
