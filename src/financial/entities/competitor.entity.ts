import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Competitor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    symbol: string;
}