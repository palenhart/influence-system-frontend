import { Component, OnInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material';
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

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.sentDataSource = new TransactionDataSource(this.transactionSentDatabase, this.sort);
    this.transactionHistoryService.getSendTransactions().then(sent =>
      this.transactionSentDatabase.refreshData(sent));


    this.receivedDataSource = new TransactionDataSource(this.transactionReceivedDatabase, this.sort);
    this.transactionHistoryService.getReceivedTransactions().then(received =>
      this.transactionReceivedDatabase.refreshData(received));
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
  constructor(private _transactionDatabase: TransactionDatabase, private _sort: MatSort) {
    super();
    _sort.active="time";
    _sort.direction="desc";
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Transaction[]> {

    const displayDataChanges = [
      this._transactionDatabase.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {

      // Sort filtered data
      const sortedData = this.sortData(this._transactionDatabase.data.slice());

      return sortedData;
    });

    //return this._transactionDatabase.dataChange;
  }

  /** Returns a sorted copy of the database data. */
  sortData(data: Transaction[]): Transaction[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }
    //if (!this._sort.active || this._sort.direction == '') { this._sort.direction = 'asc'; }

    return data.sort((a, b) => {
      let propertyA: String = '';
      let propertyB: String = '';

      switch (this._sort.active) {
        case 'time': [propertyA, propertyB] = [a.timestamp, b.timestamp]; break;
        //case 'receivedTime': [propertyA, propertyB] = [a.timestamp, b.timestamp]; break;
        //case 'userName': [propertyA, propertyB] = [a.name, b.name]; break;
        //case 'progress': [propertyA, propertyB] = [a.progress, b.progress]; break;
        //case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

  disconnect() { }
}