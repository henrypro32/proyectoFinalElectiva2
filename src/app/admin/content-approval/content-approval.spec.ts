import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentApproval } from './content-approval';

describe('ContentApproval', () => {
  let component: ContentApproval;
  let fixture: ComponentFixture<ContentApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
