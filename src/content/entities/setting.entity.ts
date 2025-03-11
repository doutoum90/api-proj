import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Setting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
