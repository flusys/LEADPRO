import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseCash } from './user-wise-cash';

describe('UserWiseCash', () => {
  let component: UserWiseCash;
  let fixture: ComponentFixture<UserWiseCash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWiseCash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserWiseCash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
