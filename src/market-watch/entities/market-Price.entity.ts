import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MarketPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column('float')
  price: number;

  @Column()
  period: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}