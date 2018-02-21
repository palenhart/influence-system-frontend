import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidAuctionComponent } from './bid-auction.component';

describe('BidAuctionComponent', () => {
  let component: BidAuctionComponent;
  let fixture: ComponentFixture<BidAuctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidAuctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidAuctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
