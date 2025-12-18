import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Roles } from 'src/enums/roles.enum';
import { Priority } from 'src/enums/priority.enum';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/auth.guard';
import { Users } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    @InjectRepository(Users)
    private userRepo:Repository<Users>
  ) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: any) {
    // req.user comes from LocalStrategy.validate()
    return this.authService.login(req.user);
  }
  //////////////////////////
  @Get('roles')
  getRoles() {
    return Object.values(Roles);
  }

  //////////////////////////

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers(@Req() req: any) {
    return this.authService.getAllUsers(req.user);
  }

  @Get('agents')
  @UseGuards(JwtAuthGuard)
  getAgents() {
    return this.userRepo.find({
      where: { role: Roles.AGENT },
      select: ['id', 'name', 'email'],
    });
  }
}