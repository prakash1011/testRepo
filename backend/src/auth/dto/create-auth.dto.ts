import {
  IsArray,
  IsEmail,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Roles } from 'src/enums/roles.enum';

class PhoneDto {
  @IsString()
  phone: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Roles)
  role: Roles;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneDto)
  phNumber: PhoneDto[];
}
