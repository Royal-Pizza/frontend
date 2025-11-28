import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletRecharge } from './wallet-recharge';

describe('WalletRecharge', () => {
  let component: WalletRecharge;
  let fixture: ComponentFixture<WalletRecharge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletRecharge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletRecharge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
