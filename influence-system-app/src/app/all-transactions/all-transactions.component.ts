import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Transaction } from '../transaction';
import { TransactionHistoryService } from '../services/transaction-history.service';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.css']
})
export class AllTransactionsComponent implements OnInit {

  displayedSentColumns = ['time', 'sender', 'receiver', 'amount', 'type', 'division', 'department', 'message'];
  transactionDatabase = new TransactionDatabase();
  transactionDataSource: TransactionDataSource | null;

  constructor(private transactionHistoryService: TransactionHistoryService) { }

  ngOnInit() {
    this.transactionDataSource = new TransactionDataSource(this.transactionDatabase);
    this.transactionHistoryService.getAllTransactions().then(transactions =>
      this.transactionDatabase.refreshData(transactions));
  }

}

export class TransactionDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Transaction[]> = new BehaviorSubject<Transaction[]>([]);
  get data(): Transaction[] { return this.dataChange.value; }

  constructor() {
    this.dataChange.next(this.data);
  }

  refreshData(transactions) {
    this.dataChange.next(transactions);
  }


}

/**
* Data source to provide what data should be rendered in the table. Note that the data source
* can retrieve its data in any way. In this case, the data source is provided a reference
* to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
* the underlying data. Instead, it only needs to take the data and send the table exactly what
* should be rendered.
*/
export class TransactionDataSource extends DataSource<any> {
  constructor(private _transactionDatabase: TransactionDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Transaction[]> {
    return this._transactionDatabase.dataChange;
  }

  disconnect() { }
}