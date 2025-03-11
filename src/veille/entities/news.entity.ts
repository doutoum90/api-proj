import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    image: string;
}       