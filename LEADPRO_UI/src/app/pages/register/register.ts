import { Component, inject } from '@angular/core';
import { PersonalInformation } from '../../modules/register/components/personal-information/personal-information';
import { AuthenticationStateService } from '@flusys/flusysng/auth/services';
import { AngularModule, PrimeModule } from '@flusys/flusysng/shared/modules';

@Component({
  selector: 'app-register',
  imports: [
    PersonalInformation,
    AngularModule,
    PrimeModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  authStateService = inject(AuthenticationStateService);

}
