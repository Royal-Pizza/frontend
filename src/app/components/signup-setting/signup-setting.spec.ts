import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupAndSettingComponent } from './signup-setting';

describe('Signup', () => {
  let component: SignupAndSettingComponent;
  let fixture: ComponentFixture<SignupAndSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupAndSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupAndSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
