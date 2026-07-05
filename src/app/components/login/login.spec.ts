import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogingComponent } from './login';

describe('Loging', () => {
  let component: LogingComponent;
  let fixture: ComponentFixture<LogingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
