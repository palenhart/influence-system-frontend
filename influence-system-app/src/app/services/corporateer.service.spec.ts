import { TestBed, inject } from '@angular/core/testing';

import { CorporateerService } from './corporateer.service';

describe('CorporateerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorporateerService]
    });
  });

  it('should be created', inject([CorporateerService], (service: CorporateerService) => {
    expect(service).toBeTruthy();
  }));
});
