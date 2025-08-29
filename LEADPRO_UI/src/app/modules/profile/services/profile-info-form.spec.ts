import { TestBed } from '@angular/core/testing';

import { ProfileInfoForm } from './profile-info-form';

describe('ProfileInfoForm', () => {
  let service: ProfileInfoForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileInfoForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
