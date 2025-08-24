import {
  Controller,
  Get,
  Res,
  Query,
  UseFilters,
  UseGuards,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '@flusys/flusysnest/core/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiController } from '@flusys/flusysnest/shared/apis';
import { TypeOrmExceptionFilter } from '@flusys/flusysnest/shared/errors';
import { EncryptionDataDto, EncryptionKeyDto } from './encryption.dto';
import { IEncryptionData, IEncryptionKey } from './encryption.interface';
import {
  EncryptionDataService,
  EncryptionKeyService,
} from './encryption.service';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Response } from 'express';
import os from 'os';
import path from 'path';
import { User } from '@flusys/flusysnest/shared/decorators';
import { ILoggedUserInfo } from '@flusys/flusysnest/shared/interfaces';
import { EmailService } from '@flusys/flusysnest/shared/modules';
import { envConfig } from '@flusys/flusysnest/core/config';
import { FilterAndPaginationDto } from '@flusys/flusysnest/shared/dtos';

const DOWNLOAD_TOKENS = new Map<string, number>(); // token -> expiry timestamp

@Controller('encrypted-key')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class EncryptionKeyController extends ApiController<
  EncryptionKeyDto,
  IEncryptionKey,
  EncryptionKeyService
> {
  constructor(protected encryptedKeyService: EncryptionKeyService) {
    super(encryptedKeyService);
  }
}

@Controller('encrypted-data')
@ApiBearerAuth()
@UseFilters(TypeOrmExceptionFilter)
@UseGuards(JwtAuthGuard)
export class EncryptionDataController extends ApiController<
  EncryptionDataDto,
  IEncryptionData,
  EncryptionDataService
> {
  constructor(
    protected encryptedDataService: EncryptionDataService,
    private mailService: EmailService,
  ) {
    super(encryptedDataService);
  }

  @Get('download')
  async downloadAll(
    @Res() res: Response,
    @Query('token') token?: string,
    @Query('key_id') keyId?: string, // required
  ): Promise<void> {
    // 1️⃣ Validate key_id
    if (!keyId) {
      res.status(400).json({ message: 'key_id query parameter is required' });
      return;
    }

    // 2️⃣ Validate token
    if (
      !token ||
      !DOWNLOAD_TOKENS.has(token) ||
      DOWNLOAD_TOKENS.get(token)! < Date.now()
    ) {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    // 3️⃣ Invalidate token (one-time use)
    DOWNLOAD_TOKENS.delete(token);

    try {
      // 4️⃣ Fetch the data for this key_id
      const dataToDownload = (
        await this.encryptedDataService.getAll('', {
          filter: { key_id: keyId },
          select: [
            'id',
            'key',
            'storedEncryptionData',
            'storedIV',
            'storedEncryptionAESKey',
          ],
        } as unknown as FilterAndPaginationDto)
      ).result;

      if (!dataToDownload || !dataToDownload.length) {
        res
          .status(404)
          .json({ message: 'No password data found for this key_id' });
        return;
      }

      // 5️⃣ Set download headers
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="passwords.json"',
      );

      // 6️⃣ Send JSON
      res.send(JSON.stringify(dataToDownload, null, 2));
    } catch (err) {
      console.error('Failed to download passwords:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Get('download-token/:key_id')
  async generateDownloadToken(
    @Param('key_id') keyId: string,
    @User() user: ILoggedUserInfo,
  ): Promise<{ message: string }> {
    try {
      // 1️⃣ Generate a secure token
      const token = crypto.randomBytes(32).toString('hex');

      // 2️⃣ Set token expiration (5 minutes)
      const expires = Date.now() + 5 * 60 * 1000; // 5 min
      DOWNLOAD_TOKENS.set(token, expires);

      // 3️⃣ Construct download URL
      const downloadUrl = `${envConfig.tryGetValue('BACKEND_URL_LINK', true)}/encrypted-data/download?token=${token}&key_id=${keyId}`;

      // 4️⃣ Send email with the link
      await this.mailService.sendEmail({
        to:
          user.email == 'sfd.mhrana@gmail.com'
            ? 'test.mhrana@gmail.com'
            : user.email,
        subject: 'Your Password Download Link',
        html: `
        <p>Hello ${user.name},</p>
        <p>You requested a download link for your password.</p>
        <p>Click the link below to download (valid for 5 minutes):</p>
        <a href="${downloadUrl}" target="_blank">${downloadUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
      });

      // 5️⃣ Return success message
      return { message: 'Download link sent to your email successfully.' };
    } catch (error) {
      console.error('Error generating download token:', error);
      throw new InternalServerErrorException(
        'Failed to generate download link',
      );
    }
  }
}
