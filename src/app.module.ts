import { AppointmentsModule } from './appointments/appointments.module';
import { UserModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    AppointmentsModule,
    MongooseModule.forRoot(
      'mongodb+srv://sarah:sarahsoftware13@cluster0.2odxd.mongodb.net/zem?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot({  isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
