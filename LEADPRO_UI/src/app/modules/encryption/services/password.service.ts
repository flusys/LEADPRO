import { Injectable } from '@angular/core';
import { IPassword } from '../interfaces/password.interface';
import { EncryptionService } from './encryption.service';
import { IEncryptionData } from '../interfaces/encrypted.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { IResponsePayload } from '@flusys/flusysng/shared/interfaces';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private apiUrl = environment.apiBaseUrl + '/encrypted-data';

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}

  // Get all passwords (decrypted)
  getAll(
    selectedKeyId: string
  ): Observable<IResponsePayload<IEncryptionData[]>> {
    return this.http.post<IResponsePayload<IEncryptionData[]>>(
      this.apiUrl + '/get-all',
      {
        filter: { key_id: selectedKeyId },
        select: [
          'id',
          'key',
          'storedEncryptionData',
          'storedIV',
          'storedEncryptionAESKey',
        ],
      }
    );
  }

  // Get password by ID (decrypted)
  getById(id: string): Observable<IPassword | undefined> {
    return this.http
      .post<IResponsePayload<IEncryptionData>>(`${this.apiUrl}/get/${id}`, {})
      .pipe(
        switchMap((response) => {
          if (response.success && response.result) {
            return from(this.decryptPassword(response.result));
          }
          return of(undefined);
        })
      );
  }

  // Create password (encrypt before sending)
  create(password: IPassword): Observable<IResponsePayload<IEncryptionData>> {
    return from(this.encryptPassword('', password)).pipe(
      switchMap((encrypted) =>
        this.http.post<IResponsePayload<IEncryptionData>>(
          this.apiUrl + '/insert',
          encrypted
        )
      )
    );
  }

  // Update password (fetch, decrypt, update, re-encrypt, send)
  update(
    id: string,
    updated: IPassword
  ): Observable<IResponsePayload<IEncryptionData>> {
    return this.getById(id).pipe(
      switchMap((decrypted) => {
        if (!decrypted) {
          return throwError(() => new Error('Password not found'));
        }
        return from(this.encryptPassword(id, { ...decrypted, ...updated }));
      }),
      switchMap((reEncrypted) =>
        this.http.post<IResponsePayload<IEncryptionData>>(
          `${this.apiUrl}/update`,
          reEncrypted
        )
      )
    );
  }

  // Delete password
  delete(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/delete`, {
      id,
      type: 'permanent',
    });
  }

  // Generate a secure download token
  getDownloadToken(key_id:string): Observable<{message:string}> {
    return this.http.get<{message:string}>(
      `${this.apiUrl}/download-token/${key_id}`
    );
  }

  // Download the passwords file using the token
  downloadPasswords(token: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download?token=${token}`, {
      responseType: 'blob',
    });
  }

  // Encrypt password for backend
  private async encryptPassword(
    id: string,
    password: IPassword
  ): Promise<Partial<IEncryptionData> | null> {
    const aesKey = await this.encryptionService.generateAESKey();
    const { encryptedData, iv } = await this.encryptionService.encryptData(
      JSON.stringify(password),
      aesKey
    );
    const encryptedAESKey = await this.encryptionService.encryptAESKey(aesKey);
    const selectedPublicKey = this.encryptionService.selectedKeyInfo();
    if (selectedPublicKey && selectedPublicKey.id) {
      return {
        id,
        key: selectedPublicKey.id,
        storedEncryptionData:
          this.encryptionService.arrayBufferToBase64(encryptedData),
        storedIV: this.encryptionService.arrayBufferToBase64(iv.buffer),
        storedEncryptionAESKey:
          this.encryptionService.arrayBufferToBase64(encryptedAESKey),
      };
    }
    return null;
  }

  // Decrypt list of encrypted passwords
  public async decryptPassword(ep: IEncryptionData): Promise<IPassword> {
    const encryptedData = this.encryptionService.base64ToArrayBuffer(
      ep.storedEncryptionData
    );
    const iv = new Uint8Array(
      this.encryptionService.base64ToArrayBuffer(ep.storedIV)
    );
    const encryptedAESKey = this.encryptionService.base64ToArrayBuffer(
      ep.storedEncryptionAESKey
    );
    const aesKey = await this.encryptionService.decryptAESKey(encryptedAESKey);
    return JSON.parse(
      await this.encryptionService.decryptData(encryptedData, iv, aesKey)
    );
  }
}
