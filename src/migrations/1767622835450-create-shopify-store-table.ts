import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateShopifyStoreTable1767622835450 implements MigrationInterface {
  name = 'CreateShopifyStoreTable1767622835450'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`shopify_stores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`shopDomain\` varchar(255) NOT NULL, \`accessToken\` varchar(255) NULL, \`scopes\` varchar(255) NULL, \`state\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`shopName\` varchar(255) NULL, \`email\` varchar(255) NULL, \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_d6da4e6f6ccdb4de3807dfba0c\` (\`shopDomain\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_d6da4e6f6ccdb4de3807dfba0c\` ON \`shopify_stores\``)
    await queryRunner.query(`DROP TABLE \`shopify_stores\``)
  }
}
