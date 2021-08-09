import { Appointment } from './../models/appointment.model';
import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel('Appointments')
    private readonly appointmentModel: Model<Appointment>,
  ) {}

  async insertAppointment(docId: string, patientId: string, time: string) {
    const newAppointment = new this.appointmentModel({
      doctorId: docId,
      patientId,
      time,
    });
    const result = await newAppointment.save();
    return result;
  }

  async updateAppointment(appId: string, treatment: string) {
    let updatedAppointment;
    try {
     updatedAppointment = await this.appointmentModel
      .findById(appId)
      .exec();
      if (treatment) {
        updatedAppointment.treatment = treatment;
        updatedAppointment.status = 'done';
      }
    }
    catch {
      throw new NotFoundException('user not available')
    }
    updatedAppointment.save();
  }
}
