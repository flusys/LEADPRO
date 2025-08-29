import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPem } from './import-pem';

describe('ImportPem', () => {
  let component: ImportPem;
  let fixture: ComponentFixture<ImportPem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportPem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportPem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
