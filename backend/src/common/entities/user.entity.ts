import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PhNumber } from './phNo.entity';
import { Roles } from 'src/enums/roles.enum';
import { Ticket } from '../../ticket/entities/ticket.entity';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
  })
  role: Roles;

  @OneToMany(() => PhNumber, (phNumber) => phNumber.user, { cascade: true })
  phNumber: PhNumber[];

  @OneToMany(() => Ticket, (tickets) => tickets.assignedAgent)
  tickets: Ticket[];
}
