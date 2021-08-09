import * as mongoose from 'mongoose';

export const AppointmentSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  patientId: { type: String },
  time: { type: Date, required: true },
  treatment: {type: String, default: null},
  status: { type: String, default: 'pending' },
});

export interface Appointment extends mongoose.Document {
  id: string;
  doctorId: string;
  patientId: string;
  treatment: string;
  time: string;
  status: string;
}
