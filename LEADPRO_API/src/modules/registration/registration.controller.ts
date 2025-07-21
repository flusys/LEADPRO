import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { IResponsePayload, ILoggedUserInfo } from '@flusys/flusysnest/shared/interfaces';
import { RegistrationService } from './registration.service';
import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { RegistrationDto } from './registration.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, getUploadPath, UploadService } from '@flusys/flusysnest/modules/gallery/apis';
import { JwtAuthGuard } from "@flusys/flusysnest/shared/guards";
import { IProfileInfo } from './profile-info-data.interface';
import { User } from "@flusys/flusysnest/shared/decorators";

@Controller('auth')
export class RegistrationController {
  private logger = new Logger(RegistrationController.name);

  constructor(private registrationService: RegistrationService,
    private uploadService: UploadService,
  ) {
  }

  @Version(VERSION_NEUTRAL)
  @Post('registration')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'personalPhoto', maxCount: 1 },
      { name: 'nidPhoto', maxCount: 1 },
      { name: 'nomineeNidPhoto', maxCount: 1 },
    ], {
      storage: diskStorage({
        filename: editFileName,
        destination: getUploadPath,
      }),
    }),
  )
  async registration(
    @Body() registrationDto: RegistrationDto,
    @UploadedFiles()
    files: {
      personalPhoto: Express.Multer.File[];
      nidPhoto: Express.Multer.File[];
      nomineeNidPhoto: Express.Multer.File[];
    },
    @Req() req,
  ): Promise<IResponsePayload<IUser>> {
    const personalPhoto = this.uploadService.makeFileResponseObject(files.personalPhoto, req);
    const nidPhoto = this.uploadService.makeFileResponseObject(files.nidPhoto, req);
    const nomineeNidPhoto = this.uploadService.makeFileResponseObject(files.nomineeNidPhoto, req);
    const photoObjectArray = [personalPhoto[0], nidPhoto[0], nomineeNidPhoto[0]];
    return await this.registrationService.registerUser(photoObjectArray, registrationDto);
  }


  @Version(VERSION_NEUTRAL)
  @Get("profile/:id")
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param("id") id: number,
    @User() user: ILoggedUserInfo,
  ): Promise<IResponsePayload<IProfileInfo>> {
    return await this.registrationService.findById(id,user);
  }




}
