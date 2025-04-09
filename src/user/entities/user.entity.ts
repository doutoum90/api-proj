import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires?: Date;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column({ nullable: true })
  profession?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'enum', enum: ['Essentiel', 'PRO', 'Expert'], default: 'Essentiel' })
  typeAbonnement: 'Essentiel' | 'PRO' | 'Expert';

  @Column({ type: 'timestamp', nullable: true })
  trialStartDate?: Date;

  @Column({ default: true })
  trialActive: boolean;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  stripeCustomerId?: string;

  @UpdateDateColumn()
  updatedAt: Date;
}