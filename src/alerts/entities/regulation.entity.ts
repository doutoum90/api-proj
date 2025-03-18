import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Regulation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    status: string;

    @Column()
    department: string;

    @Column()
    effectiveDate: Date;

    @Column()
    category: string;
}