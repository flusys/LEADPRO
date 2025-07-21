import { TestBed } from '@angular/core/testing';

import { ProfileInfoApi } from './profile-info-api';

describe('ProfileInfoApi', () => {
  let service: ProfileInfoApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileInfoApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
