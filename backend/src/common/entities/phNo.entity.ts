import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./user.entity";

@Entity()
export class PhNumber{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    phone: string;
        
    @ManyToOne(()=>Users,(user) => user.phNumber)
    user:Users
}