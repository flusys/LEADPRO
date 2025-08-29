import { Component, inject, signal } from '@angular/core';
import { EncryptionService } from '../../services/encryption.service';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-import-pem',
  imports: [
    FileUploadModule,
    FormsModule,
    ButtonModule
  ],
  templateUrl: './import-pem.html',
  styleUrl: './import-pem.scss'
})
export class ImportPem {
  encService = inject(EncryptionService);
  manualPem = signal('');

  onFileSelected(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const pemText = reader.result as string;
      await this.encService.importPemKey(pemText, true);
    };
    reader.readAsText(file);
  }

  onSubmitPem() {
    this.encService.importPemKey(this.manualPem(), true);
  }
}
