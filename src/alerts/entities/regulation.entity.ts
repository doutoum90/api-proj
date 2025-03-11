import { Column, Entity } from "typeorm";

import { PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Regulation {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    url: string;
    @Column()
    image: string; 
    @Column()
    date: Date;
    @Column()
    status: string;
    @Column()
    type: string;
    
}
    