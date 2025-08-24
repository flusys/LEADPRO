import { Injectable } from '@angular/core';
import { IPassword } from '../interfaces/password.interface';
import { EncryptionService } from './encryption.service';
import { IEncryptedPassword } from '../interfaces/encrypted.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private apiUrl = environment.apiBaseUrl + '/passwords';

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) {}

  // Get all passwords (decrypted)
  getAll(): Observable<IEncryptedPassword[]> {
    return this.http.get<IEncryptedPassword[]>(this.apiUrl);
  }

  // Get password by ID (decrypted)
  getById(id: string): Observable<IPassword | undefined> {
    return this.http.get<IEncryptedPassword>(`${this.apiUrl}/${id}`).pipe(
      switchMap((encrypted) => from(this.decryptPassword(encrypted))),
      map((decrypted) => decrypted)
    );
  }

  // Create password (encrypt before sending)
  create(password: IPassword): Observable<IEncryptedPassword> {
    return from(this.encryptPassword(password)).pipe(
      switchMap((encrypted) =>
        this.http.post<IEncryptedPassword>(this.apiUrl, encrypted)
      )
    );
  }

  // Update password (fetch, decrypt, update, re-encrypt, send)
  update(id: string, updated: IPassword): Observable<IEncryptedPassword> {
    return this.getById(id).pipe(
      switchMap((decrypted) => {
        if (!decrypted) throw new Error('Password not found');
        return from(this.encryptPassword({ ...decrypted, ...updated })).pipe(
          switchMap((reEncrypted) =>
            this.http.put<IEncryptedPassword>(
              `${this.apiUrl}/${id}`,
              reEncrypted
            )
          )
        );
      })
    );
  }

  // Delete password
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Generate a secure download token
  getDownloadToken(): Observable<{ token: string; expires: number }> {
    return this.http.get<{ token: string; expires: number }>(
      `${this.apiUrl}/download-token`
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
    password: IPassword
  ): Promise<Partial<IEncryptedPassword>> {
    const aesKey = await this.encryptionService.generateAESKey();
    const { encryptedData, iv } = await this.encryptionService.encryptData(
      JSON.stringify(password),
      aesKey
    );
    const encryptedAESKey = await this.encryptionService.encryptAESKey(aesKey);
    return {
      storedEncryptedData:
        this.encryptionService.arrayBufferToBase64(encryptedData),
      storedIV: this.encryptionService.arrayBufferToBase64(iv.buffer),
      storedEncryptedAESKey:
        this.encryptionService.arrayBufferToBase64(encryptedAESKey),
    };
  }

  // Decrypt list of encrypted passwords
  public async decryptPassword(ep: IEncryptedPassword): Promise<IPassword> {
    const encryptedData = this.encryptionService.base64ToArrayBuffer(
      ep.storedEncryptedData
    );
    const iv = new Uint8Array(
      this.encryptionService.base64ToArrayBuffer(ep.storedIV)
    );
    const encryptedAESKey = this.encryptionService.base64ToArrayBuffer(
      ep.storedEncryptedAESKey
    );
    const aesKey = await this.encryptionService.decryptAESKey(encryptedAESKey);
    return JSON.parse(
      await this.encryptionService.decryptData(encryptedData, iv, aesKey)
    );
  }
}
