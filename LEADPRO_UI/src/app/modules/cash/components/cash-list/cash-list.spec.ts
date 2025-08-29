import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashList } from './cash-list';

describe('CashList', () => {
  let component: CashList;
  let fixture: ComponentFixture<CashList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
