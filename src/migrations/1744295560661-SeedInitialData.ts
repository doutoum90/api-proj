import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';


export class SeedInitialData1744295560661 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin', 10);
    const { adminEmail, name, lastname, dateOfBirth } = {
      adminEmail: 'admin@admin.com',
      name: 'John',
      lastname: 'Doe',
      dateOfBirth: new Date().toISOString(),
    };

    await queryRunner.query(
      `
      INSERT INTO "user" (name, lastname, email, password, "dateOfBirth", profession, "typeAbonnement") 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [name, lastname, adminEmail, hashedPassword, dateOfBirth, 'Profession 1', 'Essentiel']
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "user" 
      WHERE email = 'admin@admin.com'
    `);
  }
}