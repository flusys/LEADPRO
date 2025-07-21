import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOtherInformation } from './profile-other-information';

describe('ProfileOtherInformation', () => {
  let component: ProfileOtherInformation;
  let fixture: ComponentFixture<ProfileOtherInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileOtherInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileOtherInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
