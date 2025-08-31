import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetail } from './file-detail';

describe('FileDetail', () => {
  let component: FileDetail;
  let fixture: ComponentFixture<FileDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
