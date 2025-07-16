import { TestBed } from '@angular/core/testing';

import { RegisterApi } from './register-api';

describe('RegisterApi', () => {
  let service: RegisterApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
