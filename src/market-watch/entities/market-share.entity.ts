import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MarketShare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  competitor: string;

  @Column('float')
  sharePercentage: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}