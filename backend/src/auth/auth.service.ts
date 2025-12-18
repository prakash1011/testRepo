import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Users } from 'src/common/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existing_user = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (existing_user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role,
      phNumber: createUserDto.phNumber,
    });

    const savedUser = await this.userRepo.save(user);

    return {
      message: 'User registered successfully',
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };
  }

  async validateUser(email: string, password: string) {
    console.log('LOCAL STRATEGY HIT', email);
    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'role', 'password'],
    });
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getAllUsers(admin: Users) {
    if (admin.role !== Roles.ADMIN) {
      throw new ForbiddenException('Only admin allowed');
    }

    return this.userRepo.find({
      select: ['id', 'name', 'email', 'role'],
      order: { id: 'DESC' },
    });
  }
}
