import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletRechargeComponent } from './wallet-recharge';

describe('WalletRecharge', () => {
  let component: WalletRechargeComponent;
  let fixture: ComponentFixture<WalletRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletRechargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
