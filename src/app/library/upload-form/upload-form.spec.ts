import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadForm } from './upload-form';

describe('UploadForm', () => {
  let component: UploadForm;
  let fixture: ComponentFixture<UploadForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
