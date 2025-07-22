import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery, User } from '@flusys/flusysnest/persistence/entities';
import { UserPersonalInfo } from './user-personal-info.entity';
import { UploadModule } from '@flusys/flusysnest/modules/gallery/apis';
import { UtilsModule } from '@flusys/flusysnest/shared/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPersonalInfo,
      Gallery
    ]),
    UploadModule,
    UtilsModule
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule { }
