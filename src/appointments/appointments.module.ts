import { AppointmentSchema } from './../models/appointment.model';
import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Appointments', schema: AppointmentSchema}]), JwtStrategy],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService, MongooseModule]
})
export class AppointmentsModule {};