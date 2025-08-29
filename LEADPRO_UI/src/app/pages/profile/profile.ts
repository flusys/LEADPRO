import { Component, input } from '@angular/core';
import { ProfileComponent } from '@flusys/flusysng/modules/settings/user/components';
import { ProfileOtherInformation } from '../../modules/profile/components/profile-other-information/profile-other-information';


@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileComponent,
    ProfileOtherInformation
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  id = input<string>('');
}
