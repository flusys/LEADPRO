import { inject, Injectable } from '@angular/core';
import { IRegistrationForm } from '../interfaces/register-form.interface';
import { FormCommonClass } from '@flusys/flusysng/shared/classes';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RegisterForm extends FormCommonClass<IRegistrationForm> {
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IRegistrationForm>({
      fullName: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      personalPhoto: new FormControl<File | null>(null, {
        nonNullable: true,
        validators: Validators.required,
      }),
      nidPhoto: new FormControl<File | null>(null, {
        nonNullable: true,
        validators: Validators.required,
      }),
      fatherName: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      motherName: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      maritalStatus: new FormControl<'Single' | 'Married' | 'Divorced' | 'Widowed'>('Single', {
        nonNullable: true,
        validators: Validators.required,
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      presentAddress: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      permanentAddress: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      phoneNumber: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      profession: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      referenceUserId: new FormControl('', {
        nonNullable: true,
      }),
      nomineeName: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      relationWithNominee: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      nomineeNidPhoto: new FormControl<File | null>(null, {
        nonNullable: true,
        validators: Validators.required,
      }),
      comments: new FormControl<string | null>(null),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
    this.formGroup.setValidators(this.passwordMatchValidator);
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
