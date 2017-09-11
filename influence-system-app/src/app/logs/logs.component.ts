import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Log } from '../log';
import { ObjectService } from '../services/object.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  displayedLogColumns = ['time', 'username', 'action'];
  logDatabase = new LogDatabase();
  logDataSource: LogDataSource | null;

  constructor(private objectService: ObjectService) { }

  ngOnInit() {
    this.logDataSource = new LogDataSource(this.logDatabase);
    this.objectService.getLogs().then(logs =>
      this.logDatabase.refreshData(logs));
  }

}

export class LogDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Log[]> = new BehaviorSubject<Log[]>([]);
  get data(): Log[] { return this.dataChange.value; }

  constructor() {
    this.dataChange.next(this.data);
  }

  refreshData(logs) {
    this.dataChange.next(logs);
  }


}

/**
* Data source to provide what data should be rendered in the table. Note that the data source
* can retrieve its data in any way. In this case, the data source is provided a reference
* to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
* the underlying data. Instead, it only needs to take the data and send the table exactly what
* should be rendered.
*/
export class LogDataSource extends DataSource<any> {
  constructor(private _logDatabase: LogDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Log[]> {
    return this._logDatabase.dataChange;
  }

  disconnect() { }
}