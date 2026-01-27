import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateWoocommerceSyncTables1767344840880 implements MigrationInterface {
  name = 'CreateWoocommerceSyncTables1767344840880'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`woocommerce_orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`storeId\` int NOT NULL, \`wcId\` int NOT NULL, \`number\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`total\` decimal(10,2) NOT NULL, \`currency\` varchar(255) NOT NULL, \`rawData\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`CREATE TABLE \`woocommerce_products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`storeId\` int NOT NULL, \`wcId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`sku\` varchar(255) NULL, \`price\` decimal(10,2) NULL, \`status\` varchar(255) NULL, \`rawData\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
    await queryRunner.query(`ALTER TABLE \`woocommerce_stores\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`)
    await queryRunner.query(`ALTER TABLE \`woocommerce_stores\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`woocommerce_stores\` DROP COLUMN \`updatedAt\``)
    await queryRunner.query(`ALTER TABLE \`woocommerce_stores\` DROP COLUMN \`createdAt\``)
    await queryRunner.query(`DROP TABLE \`woocommerce_products\``)
    await queryRunner.query(`DROP TABLE \`woocommerce_orders\``)
  }
}
