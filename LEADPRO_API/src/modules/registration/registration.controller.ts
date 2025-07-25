import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { IResponsePayload, ILoggedUserInfo, IFileUploadResponse } from '@flusys/flusysnest/shared/interfaces';
import { RegistrationService } from './registration.service';
import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { RegistrationDto } from './dtos/registration.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from '@flusys/flusysnest/modules/gallery/apis';
import { JwtAuthGuard } from "@flusys/flusysnest/core/guards";
import { IProfileInfo } from './interfaces/profile-info-data.interface';
import { User } from "@flusys/flusysnest/shared/decorators";
import { ProfileInfoDto } from './dtos/profile-info.dto';

@Controller('')
export class RegistrationController {

  constructor(private registrationService: RegistrationService,
    private uploadService: UploadService,
  ) {
  }

  @Version(VERSION_NEUTRAL)
  @Post('auth/registration')
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'personalPhoto', maxCount: 1 },
      { name: 'nidPhoto', maxCount: 1 },
      { name: 'nomineeNidPhoto', maxCount: 1 },
    ]),
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
    @Query('folderPath') folderPath: string
  ): Promise<IResponsePayload<IUser>> {
    const photoObjectArray = [files.personalPhoto[0], files.nidPhoto[0], files.nomineeNidPhoto[0]];
    const urls = await this.uploadService.uploadMultipleFiles(photoObjectArray, folderPath);
    const formattedUrls = this.uploadService.makeFileResponseUrl(urls, req) as string[];
    const responseObject = photoObjectArray.map((file, index) => ({
      size: this.uploadService.bytesToKb(file.size),
      name: file.originalname,
      url: formattedUrls[index],
    }));
    return await this.registrationService.registerUser(responseObject, registrationDto);
  }


  @Version(VERSION_NEUTRAL)
  @Get("profile/:id")
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param("id") id: string,
    @User() user: ILoggedUserInfo,
  ): Promise<IResponsePayload<IProfileInfo>> {
    return await this.registrationService.findById(id, user);
  }



  @Version(VERSION_NEUTRAL)
  @Put("profile/:id")
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'nidPhoto', maxCount: 1 },
      { name: 'nomineeNidPhoto', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param("id") id: string,
    @User() user: ILoggedUserInfo,
    @Body() registrationDto: ProfileInfoDto,
    @UploadedFiles()
    files: {
      nidPhoto: Express.Multer.File[];
      nomineeNidPhoto: Express.Multer.File[];
    },
    @Req() req,
    @Query('folderPath') folderPath: string
  ): Promise<IResponsePayload<null>> {
    let nidPhotoObject: IFileUploadResponse | null = null;
    let nomineeNidPhotoObject: IFileUploadResponse | null = null;
    if (files.nidPhoto) {
      const url = await this.uploadService.uploadSingleFile(files.nidPhoto[0], folderPath);
      nidPhotoObject = {
        size: this.uploadService.bytesToKb(files.nidPhoto[0].size),
        name: files.nidPhoto[0].originalname,
        url: this.uploadService.makeFileResponseUrl(url, req) as string,
      };
    }
    if (files.nomineeNidPhoto) {
      const url = await this.uploadService.uploadSingleFile(files.nomineeNidPhoto[0], folderPath);
      nomineeNidPhotoObject = {
        size: this.uploadService.bytesToKb(files.nomineeNidPhoto[0].size),
        name: files.nomineeNidPhoto[0].originalname,
        url: this.uploadService.makeFileResponseUrl(url, req) as string,
      };
    }

    return await this.registrationService.updateProfile(
      id,
      user,
      registrationDto,
      nidPhotoObject,
      nomineeNidPhotoObject
    );
  }

}
