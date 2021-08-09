import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  NotFoundException,
  Res,
  Req,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getAllUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Post()
  async insertUser(
    @Body() user: UserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const generatedId = await this.userService.addUsers(user);

    // generate token
    const jwt = await this.jwtService.signAsync({
      userId: user.userId,
      status: true,
    });

    response.cookie('jwt', jwt, { httpOnly: true });
    user.status = true;
    return this.userService.sendEmails(user.userId, jwt);

    // return { id: generatedId };
  }

  @Patch(':id')
  async activateUser(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('token') jwtToken: string,
    @Req() request: Request,
  ) {
    const cookie = request.cookies['jwt'];

    if (jwtToken === cookie) {
      await this.userService.updateStatus(id, userId, jwtToken);
      return { message: 'you are successfully authenticated' };
    }

    return { message: 'You are not authenticated' };
  }

  @Post('login')
  async loginUser(
    @Body('userId') userId: string,
    @Body('password') pwd: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.login(userId);
    const isLogged = bcrypt.compareSync(pwd, user.password);

    if (!user) {
      throw new NotFoundException('Invalid email and password');
    }

    if (!isLogged) {
      throw new NotFoundException('Invalid email and password');
    }
    if (!user.status) {
      throw new NotFoundException('You are not authentiated');
    }

    // generate token
    const jwt = await this.jwtService.signAsync({
      id: user.id,
      username: user.userId,
      type: user.type,
    });

    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'success',
    };
  }

  @Roles('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('doctordashboard')
  async getDoctorDashboard(@Req() req) {
    const doctorUsername= req.user.username;

    return await this.userService.getAllDoctorAppointments(doctorUsername);
   
  }

  @Roles('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('patientdashboard')
  async getPatientDashboard(@Req() req) {
    const doctors = await this.userService.getAllDoctors();
    const appointments = await this.userService.getPatientAppointments(
      req.user.username,
    );

    console.log(req.user.username);

    return { doctors, appointments };
  }
}
