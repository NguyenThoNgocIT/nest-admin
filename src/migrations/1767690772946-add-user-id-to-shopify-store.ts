import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserIdToShopifyStore1767690772946 implements MigrationInterface {
  name = 'AddUserIdToShopifyStore1767690772946'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`shopify_stores\` DROP FOREIGN KEY \`FK_b2dd9bd334e5bf917a2c1f9ef7b\``)
    await queryRunner.query(`ALTER TABLE \`shopify_stores\` CHANGE \`userId\` \`user_id\` int NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`shopify_stores\` CHANGE \`user_id\` \`user_id\` int NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`shopify_stores\` CHANGE \`user_id\` \`user_id\` int NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`shopify_stores\` CHANGE \`user_id\` \`userId\` int NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`shopify_stores\` ADD CONSTRAINT \`FK_b2dd9bd334e5bf917a2c1f9ef7b\` FOREIGN KEY (\`userId\`) REFERENCES \`sys_user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`)
  }
}
