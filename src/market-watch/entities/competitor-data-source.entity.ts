import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Competitor } from './competitor.entity';

export enum DataSourceType {
    TRENDS = 'TRENDS',
    GOOGLE_TRENDS = 'GOOGLE_TRENDS',
    MARKET_SHARE = 'MARKET_SHARE',
    SEMRUSH = 'SEMRUSH',
    PRICE = 'PRICE',
    FINANCIAL = 'FINANCIAL'
}

@Entity()
export class CompetitorDataSource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: DataSourceType
    })
    type: DataSourceType;

    @Column()
    url: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'timestamp' })
    addedDate: Date;

    @ManyToOne(() => Competitor, competitor => competitor.dataSources, {
        onDelete: 'CASCADE'
    })
    competitor: Competitor;
} 