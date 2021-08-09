import { Appointment } from './../models/appointment.model';
import { UserDto } from './user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<User>,
    @InjectModel('Appointments')
    private readonly appointmentModel: Model<Appointment>,
  ) {}

  async login(userId: string): Promise<User> {
    // return this.userModel.find(user => user.userId === userId);
    const user = await this.userModel.findOne({ userId: userId });
    return user;
  }

  async getUsers() {
    return await this.userModel.find().exec();
  }

  async addUsers(user: UserDto): Promise<User> {
    // Password Hashing
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;

    // Email unique validation
    const correctUser = await this.userModel.findOne({ userId: user.userId });
    if (correctUser) throw new NotFoundException('User alread exsts');

    //creating new user
    const newUser = new this.userModel(user);
    const result = await newUser.save();
    return result;
  }

  sendEmails(userId: string, jwtToken: string) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(
      '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',
    );
    const msg = {
      to: userId, // Change to your recipient
      from: 'sarah.majeed@xord.com', // Change to your verified sender
      subject: 'User Auth',
      text: `Your token: ${jwtToken}`,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async updateStatus(id: string, userId: string, token: string) {
    const updatedUser = await this.userModel.findById(id).exec();
    if (userId === updatedUser.userId) {
      updatedUser.status = true;
    }
    updatedUser.save();
    return updatedUser;
  }

  // patients dashboard
  async getAllDoctors() {
    const doctorUsers = await this.userModel.find({
      type: 'doctor',
      status: true,
    });
 
    return doctorUsers;
  }

  async getPatientAppointments(patientId: string) {
    let patientAppointments;
    try {
      patientAppointments = await this.appointmentModel.find({ patientId });
    } catch {
      throw new NotFoundException('No available appointments');
    }

    return patientAppointments;
  }

  // ------------------------- //

  // DOCTOR DASHBOARD
  async getAllDoctorAppointments(username: string) {
    const doctor = await this.userModel.find({ userId: username }).exec();
    const doctorId = doctor[0]._id;
    const appointments = await this.appointmentModel.find({doctorId})
   
    return appointments;
  }
}
