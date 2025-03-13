import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MarketTrend {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    keyword: string;

    @Column('jsonb')
    trendData: Record<string, any>;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    region: string;
}