import { Component, inject, effect, signal, untracked } from '@angular/core';
import { IPassword } from '../../interfaces/password.interface';
import { PasswordService } from '../../services/password.service';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { concatMap, take } from 'rxjs/operators';
import { IEncryptionData } from '../../interfaces/encrypted.interfaces';
import { from } from 'rxjs';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-password',
  imports: [AngularModule, PrimeModule, ToolbarModule, DialogModule],
  templateUrl: './password.html',
  styleUrl: './password.scss',
})
export class Password {
  passwords = signal<IEncryptionData[]>([]);
  passwordDialog = false;
  deleteDialog = false;

  password: IPassword = this.initPassword();
  selectedId = signal<string | null>(null);

  private passwordService = inject(PasswordService);
  private encryptionService = inject(EncryptionService);
  private messageService = inject(MessageService);

  searchTerm = signal('');
  filteredPasswords = signal<(IPassword & { id: string })[]>([]);

  selectedPublicKeyId = signal<string>('');
  constructor() {
    effect(() => {
      const term = this.searchTerm().trim().toLowerCase();
      const encryptedList = this.passwords();
      Promise.all(
        encryptedList.map(async (item) => {
          const decrypt = await this.passwordService.decryptPassword(item);
          return { ...decrypt, id: item.id };
        })
      ).then((decryptedList) => {
        if (!term) {
          this.filteredPasswords.set(decryptedList);
        } else {
          this.filteredPasswords.set(
            decryptedList.filter(
              (p) =>
                p.username.toLowerCase().includes(term) ||
                p.notes.toLowerCase().includes(term) ||
                p.otherKeys.some(
                  (kv) =>
                    kv.key.toLowerCase().includes(term) ||
                    kv.value.toLowerCase().includes(term)
                )
            )
          );
        }
      });
    });

    effect(() => {
      const selectedPublicKey = this.encryptionService.selectedKeyInfo();
      untracked(() => {
        if (selectedPublicKey && selectedPublicKey.id) {
          this.selectedPublicKeyId.set(selectedPublicKey.id);
          this.loadPasswords();
        }
      });
    });
  }

  loadPasswords() {
    this.passwordService
      .getAll(this.selectedPublicKeyId())
      .pipe(take(1))
      .subscribe((res) => {
        if (res.success) this.passwords.set(res.result);
        else this.passwords.set([]);
      });
  }

  initPassword(): IPassword {
    return {
      username: '',
      secret: '',
      notes: '',
      otherKeys: [],
    };
  }

  openNew() {
    this.password = this.initPassword();
    this.passwordDialog = true;
  }

  editPassword(p: IPassword & { id?: string }) {
    if (p.id) this.selectedId.set(p.id);
    delete p.id;
    this.password = structuredClone(p);
    this.passwordDialog = true;
  }

  deletePassword(p: IPassword & { id?: string }) {
    if (p.id) this.selectedId.set(p.id);
    delete p.id;
    this.password = structuredClone(p);
    this.deleteDialog = true;
  }

  confirmDelete() {
    const id = this.selectedId();
    if (id) {
      this.passwordService
        .delete(id)
        .pipe(take(1))
        .subscribe(() => {
          this.showMessage(
            'warn',
            'Deleted',
            `Password "${this.password.username}" deleted`
          );
          this.afterMutation();
        });
    } else {
      this.showMessage(
        'error',
        'Error',
        'Cannot delete: Password ID is missing'
      );
    }
  }

  savePassword() {
    if (this.password.username.trim()) {
      const id = this.selectedId();
      if (id) {
        this.passwordService
          .update(id, this.password)
          .pipe(take(1))
          .subscribe(() => {
            this.showMessage(
              'info',
              'Updated',
              `Password "${this.password.username}" updated`
            );
            this.afterMutation();
          });
      } else {
        this.passwordService
          .create({
            username: this.password.username,
            secret: this.password.secret,
            notes: this.password.notes,
            otherKeys: this.password.otherKeys,
          })
          .pipe(take(1))
          .subscribe(() => {
            this.showMessage(
              'success',
              'Created',
              `Password "${this.password.username}" added`
            );
            this.afterMutation();
          });
      }
    }
  }

  afterMutation() {
    this.loadPasswords();
    this.passwordDialog = false;
    this.deleteDialog = false;
    this.password = this.initPassword();
  }

  showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({
      key: 'tst',
      severity,
      summary,
      detail,
      life: 2000,
    });
  }

  addOtherInfo() {
    this.password.otherKeys.push({ key: '', value: '' });
  }

  removeOtherInfo(index: number) {
    this.password.otherKeys.splice(index, 1);
  }

  copyToClipboard(secret: string) {
    navigator.clipboard
      .writeText(secret)
      .then(() => {
        this.showMessage('success', 'Copied!', 'Copied to clipboard');
      })
      .catch((err) => {
        this.showMessage('error', 'Error', 'Failed to copy');
        console.error('Error copying  ', err);
      });
  }

  download() {
    this.passwordService
      .getDownloadToken(this.selectedPublicKeyId())
      .pipe(take(1))
      .subscribe((res) => {
        this.showMessage('success', 'Success', res.message);
      });
  }

  onJsonFileSelected(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const jsonText = reader.result as string;
        const jsonData = JSON.parse(jsonText);
        this.bulkCreatePasswords(jsonData);
      } catch (error) {
        console.error('Invalid JSON file:', error);
        this.showMessage(
          'error',
          'Import Failed',
          'The selected file is not a valid JSON.'
        );
      }
    };

    reader.readAsText(file);
  }

  bulkCreatePasswords(passwords: IPassword[]) {
    from(passwords)
      .pipe(
        concatMap((password) =>
          this.passwordService
            .create({
              username: password.username,
              secret: password.secret,
              notes: password.notes,
              otherKeys: password.otherKeys,
            })
            .pipe(take(1))
        )
      )
      .subscribe({
        next: (res) => {
          this.showMessage('success', 'Created', `Password added successfully`);
          this.afterMutation();
        },
        error: (err) => {
          this.showMessage('error', 'Error', 'Failed to create password');
          console.error(err);
        },
        complete: () => {
          this.showMessage(
            'success',
            'Done',
            'All passwords created successfully'
          );
        },
      });
  }
}
