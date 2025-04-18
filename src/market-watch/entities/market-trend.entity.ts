import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MarketTrend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @Column()
  trendScore: number;

  @Column()
  period: string;

  @Column()
  region: string;

  @Column()
  date: Date;

  @Column('jsonb')
  trendData: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}