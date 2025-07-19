import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@flusys/flusysnest/persistence/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),

  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule { }
