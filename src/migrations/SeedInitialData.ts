import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from 'bcrypt';


export class SeedInitialData1699999999999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash('admin', 10);
        const { adminEmail, name, lastname, dateOfBirth }
            = { adminEmail: 'admin@admin.com', name: 'John', lastname: 'Doe', dateOfBirth: new Date().toISOString() };

        // ajout utilisateur
        await queryRunner.query(`
      INSERT INTO "user" (name, lastname, email, password, dateOfBirth, profession, skills, typeAbonnement) 
      VALUES 
        ('${name}', '${lastname}', ${adminEmail}, '${hashedPassword}', '${dateOfBirth}', 'Profession 1', ['Skill 1', 'Skill 2'], ['Type 1', 'Type 2']),
    `);

        // ajout de regulation
        await queryRunner.query(`
      INSERT INTO "regulation" (title, description, status, department, effectiveDate, category) 
      VALUES 
        ('Regulation 1', 'Description 1', 'Active', 'Department 1', '${dateOfBirth}', 'Category 1'),
        ('Regulation 2', 'Description 2', 'En révision', 'Department 2', '${dateOfBirth}', 'Category 2')
    `);



    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DELETE FROM "user" 
      WHERE email IN ('john@example.com', 'jane@example.com')
    `);
    }
}