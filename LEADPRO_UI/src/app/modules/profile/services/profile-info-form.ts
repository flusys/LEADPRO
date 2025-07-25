import { inject, Injectable } from '@angular/core';
import { FormCommonClass } from '@flusys/flusysng/shared/classes';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IProfileInfoForm } from '../interfaces/profile-info-form.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoForm extends FormCommonClass<IProfileInfoForm> {
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IProfileInfoForm>({
      name: new FormControl('', {
        nonNullable: true,
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
      presentAddress: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      permanentAddress: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      profession: new FormControl('', {
        nonNullable: true,
        validators: Validators.required,
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
      }),
      nidPhoto: new FormControl<File | null>(null, {
        nonNullable: true,
      }),
      nomineeNidPhotoUrl: new FormControl<string>('', {
        nonNullable: true,
      }),
      nidPhotoUrl: new FormControl<string>('', {
        nonNullable: true,
      }),
      comments: new FormControl<string | null>(null),
      referUserId: new FormControl<string>('', {
        nonNullable: true,
      }),
    });
  }

}
