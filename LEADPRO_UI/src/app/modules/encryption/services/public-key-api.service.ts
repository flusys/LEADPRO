import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '@flusys/flusysng/shared/classes';
import { IEncryptionKey } from '../interfaces/encrypted.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PublicKeyApiService extends ApiService<IEncryptionKey, IEncryptionKey> {
  constructor() {
    const http = inject(HttpClient);
    super("encrypted-key", http)
  }
}
