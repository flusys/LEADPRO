import { Component, inject } from '@angular/core';
import { ImportPem } from '../../modules/encryption/components/import-pem/import-pem';
import { EncryptionService } from '../../modules/encryption/services/encryption.service';
import { PasswordService } from '../../modules/encryption/services/password.service';
import { Password } from '../../modules/encryption/components/password/password';
import { PublicKey } from '../../modules/encryption/components/public-key/public-key';

@Component({
  selector: 'app-encryption',
  imports: [Password, ImportPem,PublicKey],
  templateUrl: './encryption.html',
  styleUrl: './encryption.scss',
})
export class Encryption {
  encService = inject(EncryptionService);
  passwordService = inject(PasswordService);
}
