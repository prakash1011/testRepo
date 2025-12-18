import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/common/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket,Users]),
    AuthModule
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
