import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/users/decorator/roles.decorator';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService) {}

  @Roles('patient')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('book')
  async createAppointment(
    @Body('doctorId') doctorId: string,
    @Body('time') time: string,
    @Req() request,
  ) {
    const patientId = request.user.username;
    return await this.appointmentService.insertAppointment(
      doctorId,
      patientId,
      time,
    );
    // this.appointmentService.insertAppointment();
  }

  // prescribe a treatment
  @Roles('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async prescribeTreatment(
    @Param('id') appId: string,
    @Body('treatment') treat: string,
  ) {
    return await this.appointmentService.updateAppointment(appId, treat);
  }
}
