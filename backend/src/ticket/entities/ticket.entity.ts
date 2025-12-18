import { Priority } from 'src/enums/priority.enum';
import { Status } from 'src/enums/status.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../common/entities/user.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.OPEN,
  })
  status: Status;

  // CUSTOMER
  @ManyToOne(() => Users, (user) => user.tickets, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  // AGENT
  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'assigned_agent_id' })
  assignedAgent: Users | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
