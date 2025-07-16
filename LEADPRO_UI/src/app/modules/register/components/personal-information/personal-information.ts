import { Component, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { RegisterForm } from '../../services/register-form';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { DividerModule } from 'primeng/divider';
import { NgForm, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-personal-information',
  imports: [
    AngularModule,
    PrimeModule,
    DividerModule
  ],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.scss'
})
export class PersonalInformation {

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });


  registrationFormService = inject(RegisterForm)
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


  submit() {
    if (this.registrationFormService.formGroup.valid) {
      const formData = this.registrationFormService.formGroup.value;
      console.log('Form Submitted', formData);
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
