import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PizzaFormComponent } from './pizza-form';

describe('PizzaForm', () => {
  let component: PizzaFormComponent;
  let fixture: ComponentFixture<PizzaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PizzaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
