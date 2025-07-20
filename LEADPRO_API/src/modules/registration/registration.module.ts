import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@flusys/flusysnest/persistence/entities';
import { UserPersonalInfo } from './user-personal-info.entity';
import { UploadModule } from '@flusys/flusysnest/modules/gallery/apis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPersonalInfo
    ]),
    UploadModule
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule { }
