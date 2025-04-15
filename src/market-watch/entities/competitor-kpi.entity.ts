import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Competitor } from './competitor.entity';

@Entity()
export class CompetitorKPI {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('float')
    value: number;

    @Column()
    date: Date;

    @Column({ nullable: true })
    source: string;

    @ManyToOne(() => Competitor, competitor => competitor.kpis)
    competitor: Competitor;
} 