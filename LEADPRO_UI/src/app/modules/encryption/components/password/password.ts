import { Component, inject, effect, signal, computed } from '@angular/core';
import { IPassword } from '../../interfaces/password.interface';
import { PasswordService } from '../../services/password.service';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { concatMap, take } from 'rxjs/operators';
import { IEncryptedPassword } from '../../interfaces/encrypted.interfaces';
import { CommonModule } from '@angular/common';
import { from } from 'rxjs';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-password',
  imports: [
    FormsModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUploadModule,
  ],
  templateUrl: './password.html',
  styleUrl: './password.scss',
})
export class Password {
  passwords = signal<IEncryptedPassword[]>([]);
  passwordDialog = false;
  deleteDialog = false;

  password: IPassword = this.initPassword();
  selectedId = signal<string | null>(null);

  private passwordService = inject(PasswordService);
  private messageService = inject(MessageService);

  searchTerm = signal('');
  filteredPasswords = signal<(IPassword & { id: string })[]>([]);

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
  }

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    this.passwordService
      .getAll()
      .pipe(take(1))
      .subscribe((list) => {
        this.passwords.set(list);
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
    this.passwordService.getDownloadToken().subscribe(({ token }) => {
      this.passwordService.downloadPasswords(token).subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'passwords.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
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
