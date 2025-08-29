import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { PublicKeyApiService } from '../../services/public-key-api.service';
import { EncryptionService } from '../../services/encryption.service';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IEncryptionKey } from '../../interfaces/encrypted.interfaces';
import { IfRowEmptyDirective } from '@flusys/flusysng/shared/directives';

@Component({
  selector: 'app-public-key',
  standalone: true,
  imports: [AngularModule, PrimeModule, IfRowEmptyDirective],
  templateUrl: './public-key.html',
  styleUrls: ['./public-key.scss'],
})
export class PublicKey implements OnInit {
  // Services
  private readonly publicKeyApiService = inject(PublicKeyApiService);
  private readonly encryptionService = inject(EncryptionService);
  private readonly messageService = inject(MessageService);

  // UI State
  isColspan = true;
  newKeyName = signal<string>('');
  isLoading = signal<boolean>(true);
  total = signal<number>(0);
  data = signal<IEncryptionKey[]>([]);
  globalFilterField = ['name'];

  ngOnInit(): void {
    this.loadKeys();
  }

  /** 🔹 Load keys from backend */
  private loadKeys(): void {
    this.isLoading.set(true);
    this.publicKeyApiService
      .getAll('', {})
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.total.set(res.total ?? 0);
            this.data.set(res.result ?? []);
            if (this.data().length) {
              this.selectPublicKey(this.data()[0]);
            }
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.showMessage('error', 'Error', 'Failed to load keys');
        },
      });
  }

  /** 🔹 Input validation (lowercase letters + underscore only) */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filtered = input.value.replace(/[^a-z_]/g, '').toLowerCase();
    this.newKeyName.set(filtered);
    input.value = filtered;
  }

  /** 🔹 Generate new key */
  async generate(): Promise<void> {
    const keyName = this.newKeyName();
    if (!keyName) {
      this.showMessage('warn', 'Sorry!', 'Enter The Key Name');
      return;
    }

    try {
      const publicKey = await this.encryptionService.generateRSAKeysForOneTime(
        keyName
      );

      const dto = { name: keyName, publicKey };
      this.publicKeyApiService
        .insert(dto)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.showMessage('success', 'Success!', res.message);
              this.newKeyName.set('');
              this.loadKeys(); // 🔄 refresh list after insert
            } else {
              this.showMessage('warn', 'Sorry!', res.message);
            }
          },
          error: () =>
            this.showMessage('error', 'Error', 'Failed to insert key'),
        });
    } catch (err) {
      this.showMessage('error', 'Error', 'RSA key generation failed');
    }
  }

  /** 🔹 Centralized message handler */
  private showMessage(
    severity: 'success' | 'warn' | 'error',
    summary: string,
    detail: string = ''
  ): void {
    this.messageService.add({
      key: 'tst',
      severity,
      summary,
      detail,
    });
  }

  /** 🔹 Select Key */
  async selectPublicKey(data: IEncryptionKey) {
    this.encryptionService.selectedKeyInfo.set(data);
    await this.encryptionService.loadPublicKey(data.publicKey);
    this.encryptionService.rsaPrivateKey.set(null);
  }
}
