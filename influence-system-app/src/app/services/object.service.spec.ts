import { TestBed, inject } from '@angular/core/testing';

import { ObjectServiceService } from './object-service.service';

describe('ObjectServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectServiceService]
    });
  });

  it('should be created', inject([ObjectServiceService], (service: ObjectServiceService) => {
    expect(service).toBeTruthy();
  }));
});
