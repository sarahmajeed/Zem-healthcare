import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

const values = ['doctor', 'patient'];

export class AppointmentDto {
  @IsEmail()
  @IsNotEmpty()
  doctorId: string;

  @IsNotEmpty()
  time: string;
  status: boolean;
}
