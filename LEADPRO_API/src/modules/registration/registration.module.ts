import { UploadModule } from '@flusys/flusysnest/modules/gallery/apis';
import { Gallery, User } from '@flusys/flusysnest/persistence/entities';
import { UtilsModule } from '@flusys/flusysnest/shared/modules';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { UserPersonalInfo } from './user-personal-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPersonalInfo, Gallery]),
    UploadModule,
    UtilsModule,
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}
