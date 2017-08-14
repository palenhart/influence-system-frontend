import { TestBed, inject } from '@angular/core/testing';

import { TransactionHistoryService } from './transaction-history.service';

describe('TransactionHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionHistoryService]
    });
  });

  it('should be created', inject([TransactionHistoryService], (service: TransactionHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
