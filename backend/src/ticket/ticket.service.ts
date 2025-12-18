import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Users } from 'src/common/entities/user.entity';
import { Roles } from 'src/enums/roles.enum';
import { Status } from 'src/enums/status.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  // ================= CUSTOMER =================

  async create(user: Users, dto: CreateTicketDto) {
    if (user.role !== Roles.CUSTOMER) {
      throw new ForbiddenException('Only customers can create tickets');
    }

    const ticket = this.ticketRepo.create({
      ...dto,
      user,
    });

    return this.ticketRepo.save(ticket);
  }

  // ================= COMMON GET =================

  async getTickets(user: Users, query?: any) {
    const {
      status,
      priority,
      sortBy = 'createdAt',
      order = 'DESC',
    } = query || {};

    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (user.role === Roles.CUSTOMER) {
      where.user = { id: user.id };
    }

    if (user.role === Roles.AGENT) {
      where.assignedAgent = { id: user.id };
    }

    return this.ticketRepo.find({
      where,
      relations: ['user', 'assignedAgent'],
      order: { [sortBy]: order },
    });
  }

  // ================= AGENT =================

  async getAssignedTickets(user: Users) {
    if (user.role !== Roles.AGENT) {
      throw new ForbiddenException();
    }

    return this.ticketRepo.find({
      where: { assignedAgent: { id: user.id } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(ticketId: number, user: Users, status: Status) {
    if (user.role === Roles.CUSTOMER) {
      throw new ForbiddenException();
    }

    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['assignedAgent'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (!ticket.assignedAgent) {
      throw new ForbiddenException('Ticket not assigned');
    }

    if (user.role === Roles.AGENT && ticket.assignedAgent.id !== user.id) {
      throw new ForbiddenException();
    }

    ticket.status = status;
    return this.ticketRepo.save(ticket);
  }

  // ================= ADMIN =================

  async assignAgent(ticketId: number, admin: Users, agentId: number) {
    if (admin.role !== Roles.ADMIN) {
      throw new ForbiddenException('Only admin can assign tickets');
    }

    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId },
      relations: ['assignedAgent'],
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    const agent = await this.userRepo.findOne({
      where: { id: agentId, role: Roles.AGENT },
    });

    if (!agent) throw new NotFoundException('Agent not found');

    ticket.assignedAgent = agent;
    ticket.status = Status.IN_PROGRESS;

    return this.ticketRepo.save(ticket);
  }
}
