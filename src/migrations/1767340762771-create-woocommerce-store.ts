import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateWoocommerceStore1767340762771 implements MigrationInterface {
  name = 'CreateWoocommerceStore1767340762771'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`woocommerce_stores\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`consumerKey\` varchar(255) NOT NULL, \`consumerSecret\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`woocommerce_stores\``)
  }
}
