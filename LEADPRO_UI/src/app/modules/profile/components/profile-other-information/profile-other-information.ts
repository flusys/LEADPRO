import { ChangeDetectorRef, Component, ElementRef, inject, input, OnInit, signal, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName, FormControl } from '@angular/forms';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { ProfileInfoForm } from '../../services/profile-info-form';
import { Router } from '@angular/router';
import { ProfileInfoApi } from '../../services/profile-info-api';
import { AuthenticationStateService } from '@flusys/flusysng/auth/services';
import { EditModeElementChangerDirective } from '@flusys/flusysng/shared/directives';
import { UserSelectComponent } from '@flusys/flusysng/shared/components';
import { IDropDown } from '@flusys/flusysng/shared/interfaces';

@Component({
  selector: 'app-profile-other-information',
  imports: [
    AngularModule,
    PrimeModule,
    //Directive
    EditModeElementChangerDirective,
    UserSelectComponent,
  ],
  templateUrl: './profile-other-information.html',
  styleUrl: './profile-other-information.scss'
})
export class ProfileOtherInformation implements OnInit {
  id = input.required<string>();
  isEditMode = input.required<boolean>();

  profileInfoApi = inject(ProfileInfoApi);
  authStateService = inject(AuthenticationStateService);
  router = inject(Router)
  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });
  private cd = inject(ChangeDetectorRef);

  editSelectedReferUser = signal<IDropDown | null>(null);

  profileInfoFormService = inject(ProfileInfoForm)
  messageService = inject(MessageService)
  maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
  ];

  onFileChange(event: Event, field: 'personalPhoto' | 'nidPhoto' | 'nomineeNidPhoto') {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.profileInfoFormService.formGroup.get(field)?.setValue(file);
      const urlField = field === 'nidPhoto' ? 'nidPhotoUrl' : 'nomineeNidPhotoUrl';
      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.profileInfoFormService.formGroup.get(urlField)?.setValue(reader.result as string);
          this.cd.markForCheck(); // Trigger change detection manually
        };
        reader.readAsDataURL(file);
      } else {
        this.profileInfoFormService.formGroup.get(urlField)?.setValue('');
        this.cd.markForCheck(); // Still needed if value changed
      }
    }
  }

  getControl(name: string) {
    return this.profileInfoFormService.control(name) as FormControl;
  }



  ngOnInit(): void {
    this.profileInfoApi.getById(this.id() ?? '').pipe(take(1)).subscribe({
      next: (res) => {
        const user = res.result;
        if (user) {
          this.profileInfoFormService.patchValue({
            ...user,
            ...{
              nidPhoto: null,
              nomineeNidPhoto: null,
              nidPhotoUrl: user.nidPhoto?.url,
              nomineeNidPhotoUrl: user.nomineeNidPhoto?.url,
              referUserId: user.referUser ? user.referUser?.id : '',
            }
          });
          this.editSelectedReferUser.set(user.referUser ? {
            label: user.referUser?.name,
            value: user.referUser?.id
          } : null);
        } else {
          const user = this.authStateService.loginUserData();
          this.profileInfoFormService.patchValue({
            name: user?.name
          });
        }
        this.cd.markForCheck();
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
      this.profileInfoApi.updateProfile(formData, this.id(), data.name?.replaceAll(' ', '_')).subscribe({
        next: (res) => {
          if (res.success) {
            this.messageService.add({
              key: 'tst',
              severity: 'success',
              summary: 'Successful',
              detail: res.message,
            });
          } else {
            this.messageService.add({
              key: 'tst',
              severity: 'warn',
              summary: 'Failed',
              detail: res.message || 'Something went wrong',
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Server Error',
            detail: err.error?.message || 'Unexpected error occurred',
          });
        },
      });
    } else {
      if (this.profileInfoFormService.formGroup.invalid) {
        this.profileInfoFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
        return;
      }
    }
  }

  getError(controlName: string): string | null {
    const control = this.profileInfoFormService.formGroup.get(controlName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) return 'This field is required';
    }
    return null;
  }

}
