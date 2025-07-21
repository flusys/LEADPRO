import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UtilsService } from '@flusys/flusysnest/shared/services';
import * as bcrypt from 'bcrypt';
import {
  ILoggedUserInfo,
  IResponsePayload
} from '@flusys/flusysnest/shared/interfaces';
import { Company, CompanyBranch, Gallery, User, UserCompany, UserCompanyBranch } from '@flusys/flusysnest/persistence/entities';
import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { RegistrationDto } from './registration.dto';
import { UserPersonalInfo } from './user-personal-info.entity';
import { IGallery } from '@flusys/flusysnest/modules/gallery/interfaces';
import { FileTypes } from '@flusys/flusysnest/shared/enums';
import * as fs from 'fs';
import { join } from 'path';
import { IProfileInfo } from './profile-info-data.interface';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(UserPersonalInfo)
    private readonly userPersonalInfoRepository: Repository<UserPersonalInfo>,
    private utilsService: UtilsService,
  ) {
  }


  async registerUser(photoObjectArray: any[], userRegister: RegistrationDto): Promise<IResponsePayload<IUser>> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if email exists
      const existingUser = await this.userRepository.findOne({ where: { email: userRegister.email } });
      if (existingUser) {
        // Inside your email check block:
        for (const file of photoObjectArray) {
          try {
            // Extract relative path after `/image/`
            const relativePath = file.url.split('/image/')[1]; // e.g., "upload/others/rana1-b7b4.png"
            // Resolve actual file path
            const fullPath = join(process.cwd(), relativePath); // → "/your-app-root/upload/others/rana1-b7b4.png"
            await fs.promises.unlink(fullPath);
          } catch (e) {
            console.warn(`Failed to delete file at ${file.url}`, e);
          }
        }

        return {
          success: false,
          message: 'Email already exists',
        };
      }

      if (userRegister.password !== userRegister.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }


      let company: Company | null = null;
      let companyBranch: CompanyBranch | null = null;
      if (!userRegister.companyReferCode) {
        return {
          success: false,
          message: 'Please Provide Refer Company',
        };
      }
      company = await queryRunner.manager.findOne(Company, { where: { slug: userRegister.companyReferCode } });
      if (!company) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Please Provide Valid Refer Id',
        };
      }
      const allCompanyBranches = await queryRunner.manager.find(CompanyBranch, { where: { company: { id: company.id } } });
      if (allCompanyBranches.length === 1) {
        companyBranch = allCompanyBranches[0];
      }

      // Mark photos as private
      photoObjectArray = photoObjectArray.map((item): IGallery => ({
        ...item,
        isPrivate: true,
        type: FileTypes.IMAGE
      }));

      // Save photos
      const savedGalleries = await this.galleryRepository.save(photoObjectArray);

      const personalPhoto = savedGalleries[0];
      const nidPhoto = savedGalleries[1];
      const nomineeNidPhoto = savedGalleries[2];

      // Save User
      const { password } = userRegister;
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(password, salt);
      const user = this.userRepository.create({
        name: userRegister.fullName,
        email: userRegister.email,
        phone: userRegister.phoneNumber,
        password: hashedPass,
        profilePicture: personalPhoto,
      });
      const savedUser = await queryRunner.manager.save(user);

      // Save UserPersonalInfo
      const userPersonalInfo = this.userPersonalInfoRepository.create({
        user: savedUser,
        fatherName: userRegister.fatherName,
        motherName: userRegister.motherName,
        maritalStatus: userRegister.maritalStatus,
        presentAddress: userRegister.presentAddress,
        permanentAddress: userRegister.permanentAddress,
        profession: userRegister.profession,
        nomineeName: userRegister.nomineeName,
        relationWithNominee: userRegister.relationWithNominee,
        nidPhoto: nidPhoto,
        nomineeNidPhoto: nomineeNidPhoto,
        comments: userRegister.comments,
      });


      // Save UserCompany
      const userCompany = queryRunner.manager.create(UserCompany, {
        user: savedUser,
        company,
        isActive: false,
        readOnly: false,
      });
      await queryRunner.manager.save(userCompany);
      // Save UserCompanyBranch
      if (companyBranch) {
        const userCompanyBranch = queryRunner.manager.create(UserCompanyBranch, {
          user: savedUser,
          company,
          companyBranch,
          isActive: true,
          readOnly: false,
        });
        await queryRunner.manager.save(userCompanyBranch);
      }

      await queryRunner.manager.save(userPersonalInfo);
      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'User registered successfully',
        data: savedUser,
      } as unknown as IResponsePayload<IUser>;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      if (error instanceof QueryFailedError && error.driverError.code === '23505') {
        const { columnName } = this.utilsService.extractColumnNameFromError(
          error.driverError.detail,
        );
        throw new ConflictException(`Duplicate value for field: ${columnName}`);
      }

      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findById(userId: number, user: ILoggedUserInfo,): Promise<IResponsePayload<IProfileInfo>> {
    try {
      if (!userId) {
        userId = user.id;
      }
      const userInformation = await this.userPersonalInfoRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user', 'nidPhoto', 'nomineeNidPhoto', 'referUser'],
      });
      
      return {
        success: true,
        message: 'User Found',
        result: userInformation,
      } as unknown as IResponsePayload<IProfileInfo>;
    } catch (error: any) {
      console.log(error);
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno == 1062) {
          throw new QueryFailedError("Duplicate Entry Error", [], error);
        }
        throw new QueryFailedError(error.message, [], error);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }


}
