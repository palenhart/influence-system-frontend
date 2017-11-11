import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Transaction } from '../transaction';
import { TransactionHistoryService } from '../services/transaction-history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  displayedSentColumns = ['time', 'receiver', 'amount', 'type', 'division', 'department', 'message'];
  displayedReceivedColumns = ['time', 'sender', 'amount', 'type', 'division', 'department', 'message'];
  transactionSentDatabase = new TransactionDatabase();
  transactionReceivedDatabase = new TransactionDatabase();
  sentDataSource: TransactionDataSource | null;
  receivedDataSource: TransactionDataSource | null;

  ngOnInit() {
    this.sentDataSource = new TransactionDataSource(this.transactionSentDatabase);
    this.transactionHistoryService.getSendTransactions().then(sent =>
      this.transactionSentDatabase.refreshData(sent));
  }

  constructor(private transactionHistoryService: TransactionHistoryService) { }
}

/** An example database that the data source uses to retrieve data for the table. */
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