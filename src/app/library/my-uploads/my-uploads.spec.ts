import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUploads } from './my-uploads';

describe('MyUploads', () => {
  let component: MyUploads;
  let fixture: ComponentFixture<MyUploads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyUploads]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyUploads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
