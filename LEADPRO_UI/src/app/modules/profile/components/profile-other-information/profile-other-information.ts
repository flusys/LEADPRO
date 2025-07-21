import { ChangeDetectorRef, Component, ElementRef, inject, input, OnInit, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { RegisterApi } from '../../../register/services/register-api';
import { ProfileInfoForm } from '../../services/profile-info-form';
import { Router } from '@angular/router';
import { ProfileInfoApi } from '../../services/profile-info-api';

@Component({
  selector: 'app-profile-other-information',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './profile-other-information.html',
  styleUrl: './profile-other-information.scss'
})
export class ProfileOtherInformation implements OnInit {
  id = input.required<number>();
  profileInfoApi = inject(ProfileInfoApi);
  router = inject(Router)
  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });
  private cd = inject(ChangeDetectorRef);


  profileInfoFormService = inject(ProfileInfoForm)
  messageService = inject(MessageService)
  maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
  ];

  onFileChange(event: Event, field: 'personalPhoto' | 'nidPhoto' | 'nomineeNidPhoto') {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.profileInfoFormService.formGroup.get(field)?.setValue(input.files[0]);
    }
  }



  ngOnInit(): void {
    this.profileInfoApi.getById(this.id()).pipe(take(1)).subscribe({
      next: (res) => {
        const user = res.result;
        this.profileInfoFormService.patchValue({
          ...user
        });
        this.cd.detectChanges();
      },
      error: (err) => {
      }
    })
  }

  subscription!: Subscription;

  submit() {
    if (this.profileInfoFormService.formGroup.valid) {
      const data = this.profileInfoFormService.formGroup.value;

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      // this.registerApi.registration(formData, data.fullName?.replaceAll(' ', '_')).subscribe({
      //   next: (res) => {
      //     if (res.success) {
      //       this.clear();
      //       this.messageService.add({
      //         key: 'tst',
      //         severity: 'success',
      //         summary: 'Registration Successful',
      //         detail: res.message,
      //       });
      //       this.router.navigate(['/auth/login']);
      //     } else {
      //       this.messageService.add({
      //         key: 'tst',
      //         severity: 'warn',
      //         summary: 'Registration Failed',
      //         detail: res.message || 'Something went wrong',
      //       });
      //     }
      //   },
      //   error: (err) => {
      //     console.error(err);
      //     this.messageService.add({
      //       key: 'tst',
      //       severity: 'error',
      //       summary: 'Server Error',
      //       detail: err.error?.message || 'Unexpected error occurred',
      //     });
      //   },
      // });
    } else {
      if (this.profileInfoFormService.formGroup.invalid) {
        this.profileInfoFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
        return;
      }
    }
  }

  clear() {
    this.profileInfoFormService.formGroup.reset();
  }

  getError(controlName: string): string | null {
    const control = this.profileInfoFormService.formGroup.get(controlName);
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
