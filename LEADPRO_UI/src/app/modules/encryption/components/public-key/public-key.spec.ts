import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicKey } from './public-key';

describe('PublicKey', () => {
  let component: PublicKey;
  let fixture: ComponentFixture<PublicKey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicKey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicKey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
