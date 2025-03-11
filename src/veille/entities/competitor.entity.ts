import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Competitors {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    url: string;
    @Column()
    logo: string;
}