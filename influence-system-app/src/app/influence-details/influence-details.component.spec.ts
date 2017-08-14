import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceDetailsComponent } from './influence-details.component';

describe('InfluenceDetailsComponent', () => {
  let component: InfluenceDetailsComponent;
  let fixture: ComponentFixture<InfluenceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluenceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
