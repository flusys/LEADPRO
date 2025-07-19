import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UtilsService } from '@flusys/flusysnest/shared/services';
import * as bcrypt from 'bcrypt';
import {
  IResponsePayload
} from '@flusys/flusysnest/shared/interfaces';
import { User } from '@flusys/flusysnest/persistence/entities';
import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { RegistrationDto } from './registration.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private utilsService: UtilsService,
  ) {
  }

  async registerUser(userRegister: RegistrationDto) {
    try {
      console.warn(userRegister)
      return {
        success: true,
        message: 'User Registered Success',
      } as unknown as IResponsePayload<IUser>;
    } catch (error: any) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.code == 23505) {
          const { columnName } =
            this.utilsService.extractColumnNameFromError(
              error.driverError.detail,
            );
          throw new QueryFailedError(
            '',
            [],
            new Error(
              `Duplicate Key Error on field: ${columnName}`,
            ),
          );
        }
        throw new QueryFailedError('', [], new Error(error.message));
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
