import { Component, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { RegisterForm } from '../../services/register-form';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { NgForm, FormControlName } from '@angular/forms';
import { RegisterApi } from '../../services/register-api';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-information',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.scss'
})
export class PersonalInformation {
  registerApi = inject(RegisterApi);
  router = inject(Router)
  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });


  registrationFormService = inject(RegisterForm)
  messageService = inject(MessageService)
  maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
  ];

  onFileChange(event: Event, field: 'personalPhoto' | 'nidPhoto' | 'nomineeNidPhoto') {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.registrationFormService.formGroup.get(field)?.setValue(input.files[0]);
    }
  }

  subscription!: Subscription;

  submit() {
    if (this.registrationFormService.formGroup.valid) {
      const data = this.registrationFormService.formGroup.value;
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
    } else {
      if (this.registrationFormService.formGroup.invalid) {
        this.registrationFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
        return;
      }
    }
  }

  clear() {
    this.registrationFormService.formGroup.reset();
  }

  getError(controlName: string): string | null {
    const control = this.registrationFormService.formGroup.get(controlName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'This field is required';
      if (control.errors?.['email']) return 'Invalid email format';
      if (control.errors?.['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
      }
    }
    return null;
  }

}
