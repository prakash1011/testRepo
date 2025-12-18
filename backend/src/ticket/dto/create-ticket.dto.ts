import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Priority } from 'src/enums/priority.enum';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
