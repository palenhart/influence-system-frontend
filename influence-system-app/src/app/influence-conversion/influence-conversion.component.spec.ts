import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceConversionComponent } from './influence-conversion.component';

describe('InfluenceConversionComponent', () => {
  let component: InfluenceConversionComponent;
  let fixture: ComponentFixture<InfluenceConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfluenceConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluenceConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
