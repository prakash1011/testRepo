import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignAgentDto {
  @Type(() => Number)
  @IsInt()
  agentId: number;
}
