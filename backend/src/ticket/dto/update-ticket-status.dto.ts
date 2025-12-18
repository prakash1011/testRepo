import { IsEnum } from 'class-validator';
import { Status } from 'src/enums/status.enum';

export class UpdateTicketStatusDto {
  @IsEnum(Status)
  status: Status;
}
