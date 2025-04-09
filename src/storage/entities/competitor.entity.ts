// competitor.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Competitor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('jsonb')
    kpis: { price: number; innovations: string[] };
}