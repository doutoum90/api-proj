import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Alert {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    message: string;

    @Column()
    severity: string;

    @Column()
    email: string;

    @Column()
    createdAt: Date;

    @Column()
    regulation: string;
}
