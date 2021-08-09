import { AppointmentsModule } from './../appointments/appointments.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '30m',
      },
    }),
    AppointmentsModule,
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, RolesGuard, JwtAuthGuard],
  exports: [UsersService, JwtStrategy],
})
export class UserModule {}
