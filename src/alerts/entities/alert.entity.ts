import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Alert {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    email: string;
    @Column()
    regulation: string;
}
