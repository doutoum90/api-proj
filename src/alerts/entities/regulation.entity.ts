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
    effectiveDate: Date;
}