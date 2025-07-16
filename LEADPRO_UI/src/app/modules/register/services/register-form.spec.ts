import { TestBed } from '@angular/core/testing';

import { RegisterForm } from './register-form';

describe('RegisterForm', () => {
  let service: RegisterForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
