import { Injectable, signal, WritableSignal } from '@angular/core';
import { IEncryptionKey } from '../interfaces/encrypted.interfaces';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  public selectedKeyInfo = signal<IEncryptionKey | null>(null);
  public rsaPublicKey: WritableSignal<CryptoKey | null> = signal(null);
  public rsaPrivateKey: WritableSignal<CryptoKey | null> = signal(null);

  async loadPublicKey(publicKey: string) {
    await this.importPemKey(publicKey, false);
  }

  // Generate RSA key pair for one-time use (run manually)
  async generateRSAKeysForOneTime(fileName: string) {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKey = await this.exportKeyToPEM(
      keyPair.publicKey as CryptoKey,
      false
    );
    this.downloadPEMKey(
      await this.exportKeyToPEM(keyPair.privateKey as CryptoKey, true),
      `${fileName}_private_key.pem`
    );

    return publicKey;
  }

  // Generate AES key
  async generateAESKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt data using AES-GCM
  async encryptData(
    data: string,
    aesKey: CryptoKey
  ): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array<ArrayBuffer> }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      new TextEncoder().encode(data)
    );
    return { encryptedData, iv };
  }

  // Decrypt data using AES-GCM
  async decryptData(
    encryptedData: ArrayBuffer,
    iv: Uint8Array<ArrayBuffer>,
    aesKey: CryptoKey
  ): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      encryptedData
    );
    return new TextDecoder().decode(decrypted);
  }

  // Encrypt AES key with RSA public key
  async encryptAESKey(aesKey: CryptoKey): Promise<ArrayBuffer> {
    if (!this.rsaPublicKey()) {
      throw new Error(
        'RSA public key not initialized. Call importPemKey() first.'
      );
    }
    const rawKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedKey = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      this.rsaPublicKey() as CryptoKey,
      rawKey
    );
    return encryptedKey;
  }

  // Decrypt AES key with RSA private key
  async decryptAESKey(encryptedKey: ArrayBuffer): Promise<CryptoKey> {
    if (!this.rsaPrivateKey()) {
      throw new Error('RSA private key not loaded');
    }
    const rawKey = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      this.rsaPrivateKey() as CryptoKey,
      encryptedKey
    );
    return await window.crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Convert ArrayBuffer to Base64 string
  arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (const b of bytes) {
      binary += String.fromCharCode(b);
    }
    return window.btoa(binary);
  }

  // Convert Base64 string to ArrayBuffer
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = window.atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
  }

  // Export CryptoKey to PEM format
  async exportKeyToPEM(key: CryptoKey, isPrivate: boolean): Promise<string> {
    const format = isPrivate ? 'pkcs8' : 'spki';
    const exported = await window.crypto.subtle.exportKey(format, key);
    const exportedAsBase64 = this.arrayBufferToBase64(exported);
    const type = isPrivate ? 'PRIVATE' : 'PUBLIC';
    return `-----BEGIN ${type} KEY-----\n${exportedAsBase64
      .match(/.{1,64}/g)
      ?.join('\n')}\n-----END ${type} KEY-----`;
  }

  async importPemKey(pem: string, isPrivate: boolean): Promise<void> {
    try {
      // Basic PEM format validation
      const header = `-----BEGIN ${isPrivate ? 'PRIVATE' : 'PUBLIC'} KEY-----`;
      const footer = `-----END ${isPrivate ? 'PRIVATE' : 'PUBLIC'} KEY-----`;

      if (!pem.includes(header) || !pem.includes(footer)) {
        throw new Error('PEM format error: Missing header or footer');
      }

      // Remove PEM headers/footers and whitespace
      const b64 = pem
        .replace(header, '')
        .replace(footer, '')
        .trim()
        .replace(/\s+/g, '');

      // Validate base64 by decoding it
      let binaryDer: ArrayBuffer;
      try {
        binaryDer = this.base64ToArrayBuffer(b64);
      } catch {
        throw new Error('PEM format error: Invalid Base64 encoding');
      }

      // Import key
      const key = await window.crypto.subtle.importKey(
        isPrivate ? 'pkcs8' : 'spki',
        binaryDer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        true,
        isPrivate ? ['decrypt'] : ['encrypt']
      );

      // Optional: verify key usages
      if (isPrivate && !key.usages.includes('decrypt')) {
        throw new Error('Invalid private key usages');
      }
      if (!isPrivate && !key.usages.includes('encrypt')) {
        throw new Error('Invalid public key usages');
      }

      // Assign to class properties (assuming these are RxJS Subjects or similar)
      if (isPrivate) {
        this.rsaPrivateKey.set(key);
      } else {
        this.rsaPublicKey.set(key);
      }
    } catch (error) {
      if (isPrivate) {
        this.rsaPrivateKey.set(null);
      } else {
        this.rsaPublicKey.set(null);
      }
    }
  }

  // Download PEM string as a file
  downloadPEMKey(pem: string, filename: string) {
    const blob = new Blob([pem], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
