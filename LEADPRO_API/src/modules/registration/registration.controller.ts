import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { IResponsePayload } from '@flusys/flusysnest/shared/interfaces';
import { RegistrationService } from './registration.service';
import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { RegistrationDto } from './registration.dto';

@Controller('auth')
export class RegistrationController {
  private logger = new Logger(RegistrationController.name);

  constructor(private registrationService: RegistrationService) {
  }

  @Version(VERSION_NEUTRAL)
  @Post('registration')
  @UsePipes(ValidationPipe)
  async registration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<IResponsePayload<IUser>> {
    return await this.registrationService.registerUser(registrationDto);
  }
}
