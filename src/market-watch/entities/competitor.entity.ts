// competitor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CompetitorDataSource } from './competitor-data-source.entity';
import { CompetitorKPI } from './competitor-kpi.entity';

@Entity()
export class Competitor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => CompetitorDataSource, dataSource => dataSource.competitor, {
        cascade: true,
        eager: true
    })
    dataSources: CompetitorDataSource[];

    @OneToMany(() => CompetitorKPI, kpi => kpi.competitor, {
        cascade: true,
        eager: true,
        nullable: true
    })
    kpis: CompetitorKPI[];

    @Column()
    domain: string;

    @Column({ nullable: true })
    industry?: string;

    @Column('jsonb', { default: [] })
    keywords: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    symbol: string;
}
