import { IsEmail, IsNotEmpty, IsIn } from 'class-validator';

const values = ['doctor', 'patient'];

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsIn(values)
  type: string;

  status: boolean;
}
