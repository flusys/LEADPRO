import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  IFileUploadResponse,
  ILoggedUserInfo,
  IResponsePayload
} from '@flusys/flusysnest/shared/interfaces';
import { Organization, OrganizationBranch, Gallery, User, Permission, } from '@flusys/flusysnest/persistence/entities';
import { IUser } from '@flusys/flusysnest/modules/settings/interfaces';
import { RegistrationDto } from './dtos/registration.dto';
import { UserPersonalInfo } from './user-personal-info.entity';
import { IGallery } from '@flusys/flusysnest/modules/gallery/interfaces';
import { FileTypes, ScopeType, SubjectType } from '@flusys/flusysnest/shared/enums';
import { IProfileInfo } from './interfaces/profile-info-data.interface';
import { ProfileInfoDto } from './dtos/profile-info.dto';
import { UploadService } from '@flusys/flusysnest/modules/gallery/apis';
import { UtilsService } from '@flusys/flusysnest/shared/modules';
import { envConfig } from '@flusys/flusysnest/core/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RegistrationService {
  private env = envConfig.getCacheConfig('user');
  private readonly logger = new Logger(RegistrationService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Gallery)
    private readonly galleryRepository: Repository<Gallery>,
    @InjectRepository(UserPersonalInfo)
    private readonly userPersonalInfoRepository: Repository<UserPersonalInfo>,
    private utilsService: UtilsService,
    private uploadService: UploadService,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
  }


  async registerUser(photoObjectArray: any[], userRegister: RegistrationDto): Promise<IResponsePayload<IUser>> {
    await this.cacheManager.set(this.env.PREVIOUS_KEY_FOR_ALL, null);
    await this.cacheManager.set(this.env.PREVIOUS_DATA_FOR_ALL, null);
    await this.cacheManager.set(this.env.PREVIOUS_TOTAL_DATA_FOR_ALL, null);
    
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Check if email exists
      const existingUser = await this.userRepository.findOne({ where: { email: userRegister.email } });
      if (existingUser) {
        const urls = photoObjectArray.map((item) => item.url);
        await this.uploadService.deleteMultipleFile(urls);
        return {
          success: false,
          message: 'Email already exists',
        };
      }

      if (userRegister.password !== userRegister.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }


      let organization: Organization | null = null;
      let organizationBranch: OrganizationBranch | null = null;
      if (!userRegister.organizationReferCode) {
        return {
          success: false,
          message: 'Please Provide Refer Organization',
        };
      }
      organization = await queryRunner.manager.findOne(Organization, { where: { slug: userRegister.organizationReferCode } });
      if (!organization) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          message: 'Please Provide Valid Refer Id',
        };
      }
      const allOrganizationBranches = await queryRunner.manager.find(OrganizationBranch, { where: { organization: { id: organization.id } } });
      if (allOrganizationBranches.length === 1) {
        organizationBranch = allOrganizationBranches[0];
      }

      // Mark photos as private
      photoObjectArray = photoObjectArray.map((item): IGallery => ({
        ...item,
        isPrivate: true,
        organization: organization,
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


      // Save Permission for Organization
      const orgPermission = queryRunner.manager.create(Permission, {
        subjectType: SubjectType.USER,
        subjectId: savedUser.id,
        scopeType: ScopeType.ORGANIZATION,
        scopeId: organization.id,
        isActive: false,
        readOnly: false,
        organizationId: organization.id,
        createdBy: savedUser.id as unknown as User, // optional if needed
      });
      await queryRunner.manager.save(orgPermission);

      // Save Permission for Organization Branch
      if (organizationBranch) {
        const branchPermission = queryRunner.manager.create(Permission, {
          subjectType: SubjectType.USER,
          subjectId: savedUser.id,
          scopeType: ScopeType.BRANCH,
          scopeId: organizationBranch.id,
          isActive: true,
          readOnly: false,
          organizationId: organization.id,
          createdBy: savedUser.id as unknown as User, // optional if needed
        });
        await queryRunner.manager.save(branchPermission);
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
      this.logger.error(error);
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


  async findById(userId: string, user: ILoggedUserInfo,): Promise<IResponsePayload<IProfileInfo>> {
    try {
      if (!userId) {
        userId = user.id;
      }
      const userInformation = await this.userPersonalInfoRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user', 'nidPhoto', 'nomineeNidPhoto', 'referUser'],
      });
      const object = userInformation ? {
        nidPhoto: userInformation.nidPhoto ? {
          id: userInformation.nidPhoto?.id,
          name: userInformation.nidPhoto?.name,
          url: userInformation.nidPhoto?.url,
          type: userInformation.nidPhoto?.type,
        } : null,
        name: userInformation.user.name,
        fatherName: userInformation.fatherName,
        motherName: userInformation.motherName,
        maritalStatus: userInformation.maritalStatus,
        presentAddress: userInformation.presentAddress,
        permanentAddress: userInformation.permanentAddress,
        profession: userInformation.profession,
        idNo: '', // You can extract this from somewhere else if available
        nomineeName: userInformation.nomineeName,
        relationWithNominee: userInformation.relationWithNominee,
        nomineeNidPhoto: userInformation.nomineeNidPhoto ? {
          id: userInformation.nomineeNidPhoto?.id,
          name: userInformation.nomineeNidPhoto?.name,
          url: userInformation.nomineeNidPhoto?.url,
          type: userInformation.nomineeNidPhoto?.type,
        } : null,
        comments: userInformation.comments,
        referUser: userInformation.referUser,
      } : null;
      return {
        success: true,
        message: 'User Found',
        result: object,
      } as unknown as IResponsePayload<IProfileInfo>;
    } catch (error: any) {
      this.logger.error(error);
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

  async updateProfile(
    userId: string,
    user: ILoggedUserInfo,
    dto: ProfileInfoDto,
    nidPhotoObject: IFileUploadResponse | null,
    nomineeNidPhotoObject: IFileUploadResponse | null,
  ): Promise<IResponsePayload<null>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // To track deletions for manual cleanup if commit succeeds
    const deletedGalleryIds: string[] = [];
    try {
      if (!userId) {
        userId = user.id;
      }

      let userInformation = await this.userPersonalInfoRepository.findOne({
        where: { user: { id: userId } },
        relations: ['user', 'nidPhoto', 'nomineeNidPhoto', 'referUser'],
      });

      if (!userInformation) {
        userInformation = queryRunner.manager.create(this.userPersonalInfoRepository.target, {
          user: { id: userId } as any,
          ...dto,
        });
        if (nidPhotoObject) {
          const gallery = queryRunner.manager.create(this.galleryRepository.target, {
            ...nidPhotoObject,
            isPrivate: true,
            type: FileTypes.IMAGE,
          } as unknown as Gallery);
          const savedGallery = await queryRunner.manager.save(this.galleryRepository.target, gallery);
          userInformation.nidPhoto = savedGallery;
        }
        if (nomineeNidPhotoObject) {
          const gallery = queryRunner.manager.create(this.galleryRepository.target, {
            ...nomineeNidPhotoObject,
            isPrivate: true,
            type: FileTypes.IMAGE,
          } as unknown as Gallery);

          const savedGallery = await queryRunner.manager.save(this.galleryRepository.target, gallery);
          userInformation.nomineeNidPhoto = savedGallery;
        }

        if (dto.referUserId) {
          const user = await this.userRepository.findOneBy({ id: dto.referUserId });
          if (!user) {
            await queryRunner.rollbackTransaction();
            return {
              success: false,
              message: 'Refer User Not Found',
            };
          }
          userInformation.referUser = { id: user.id } as User;
        }

        await queryRunner.manager.save(userInformation);

        await queryRunner.commitTransaction();
        return {
          success: true,
          message: 'Profile created successfully',
        };
      }

      // Update existing fields
      Object.assign(userInformation, {
        fatherName: dto.fatherName ?? userInformation.fatherName,
        motherName: dto.motherName ?? userInformation.motherName,
        maritalStatus: dto.maritalStatus ?? userInformation.maritalStatus,
        presentAddress: dto.presentAddress ?? userInformation.presentAddress,
        permanentAddress: dto.permanentAddress ?? userInformation.permanentAddress,
        profession: dto.profession ?? userInformation.profession,
        nomineeName: dto.nomineeName ?? userInformation.nomineeName,
        relationWithNominee: dto.relationWithNominee ?? userInformation.relationWithNominee,
        comments: dto.comments ?? userInformation.comments,
      });

      // Replace nidPhoto if new file is uploaded
      if (nidPhotoObject) {
        if (userInformation.nidPhoto) {
          deletedGalleryIds.push(userInformation.nidPhoto.id); // Save to delete later
        }
        const gallery = queryRunner.manager.create(this.galleryRepository.target, {
          ...nidPhotoObject,
          isPrivate: true,
          type: FileTypes.IMAGE,
        } as unknown as Gallery);
        const savedGallery = await queryRunner.manager.save(this.galleryRepository.target, gallery);
        userInformation.nidPhoto = savedGallery;
      }

      // Replace nomineeNidPhoto if new file is uploaded
      if (nomineeNidPhotoObject) {
        if (userInformation.nomineeNidPhoto) {
          deletedGalleryIds.push(userInformation.nomineeNidPhoto.id);
        }
        const gallery = queryRunner.manager.create(this.galleryRepository.target, {
          ...nomineeNidPhotoObject,
          isPrivate: true,
          type: FileTypes.IMAGE,
        } as unknown as Gallery);
        const savedGallery = await queryRunner.manager.save(this.galleryRepository.target, gallery);
        userInformation.nomineeNidPhoto = savedGallery;
      }
      if (dto.referUserId) {
        const user = await this.userRepository.findOneBy({ id: dto.referUserId });
        if (!user) {
          await queryRunner.rollbackTransaction();
          return {
            success: false,
            message: 'Refer User Not Found',
          };
        }
        userInformation.referUser = { id: user.id } as User;
      }
      await queryRunner.manager.save(userInformation);

      await queryRunner.commitTransaction();
      // Now delete old galleries and files AFTER successful commit
      for (const id of deletedGalleryIds) {
        await this.deleteGalleryAndFile(id);
      }
      return {
        success: true,
        message: 'User Information Updated',
      } as unknown as IResponsePayload<null>;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create/update user personal info:', error);
      return {
        success: false,
        message: 'Something went wrong while saving user information.',
      };
    }
  }

  async deleteGalleryAndFile(id: string): Promise<void> {
    try {
      const gallery = await this.galleryRepository.findOneBy({ id });
      if (!gallery) return;

      await this.galleryRepository.delete(id);
      const filePath = gallery.url.split('/image/')[1];
      await this.uploadService.deleteSingleFile(filePath);
    } catch (error) {
      this.logger.error(`Failed to delete gallery and file for ID ${id}:`, error);
    }
  }


}
