import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    date: Date;
    @Column()
    status: string;
    @Column()
    type: string;
    @Column()
    url: string;
    @Column()
    image: string;
    @Column()
    pdf: string;
}
