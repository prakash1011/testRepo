import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Priority } from 'src/enums/priority.enum';
import { Status } from 'src/enums/status.enum';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { AssignAgentDto } from './dto/assign-agent.dto';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketService.create(req.user, dto);
  }

  @Get()
  getTickets(@Req() req: any, @Query() query: any) {
    return this.ticketService.getTickets(req.user, query);
  }

  @Get('assigned')
  getAssigned(@Req() req: any) {
    return this.ticketService.getAssignedTickets(req.user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Req() req: any,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.ticketService.updateStatus(+id, req.user, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/assign')
  assignAgent(
    @Param('id') id: number,
    @Req() req: any,
    @Body() dto: AssignAgentDto,
  ) {
    return this.ticketService.assignAgent(+id, req.user, dto.agentId);
  }

  @Get('priorities')
  getPriorities() {
    return Object.values(Priority);
  }

  @Get('statuses')
  getStatuses() {
    return Object.values(Status);
  }
}
