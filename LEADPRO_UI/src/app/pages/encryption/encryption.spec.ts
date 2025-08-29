import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encryption } from './encryption';

describe('Encryption', () => {
  let component: Encryption;
  let fixture: ComponentFixture<Encryption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encryption]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Encryption);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
