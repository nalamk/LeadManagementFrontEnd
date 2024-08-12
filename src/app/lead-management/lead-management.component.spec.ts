import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadManagementComponent } from './lead-management.component';

describe('LeadManagementComponent', () => {
  let component: LeadManagementComponent;
  let fixture: ComponentFixture<LeadManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeadManagementComponent]
    });
    fixture = TestBed.createComponent(LeadManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
