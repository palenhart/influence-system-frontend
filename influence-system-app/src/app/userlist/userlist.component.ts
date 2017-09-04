import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { User } from '../user';
import { ObjectService } from '../services/object.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  displayedUserColumns = ['name', 'handle', 'tributes', 'mainDivision', 'rank', 'totalInfluence'];
  userDatabase = new UserDatabase();
  userDataSource: UserDataSource | null;

  constructor(private objectService: ObjectService) { }

  ngOnInit() {
    this.userDataSource = new UserDataSource(this.userDatabase);
    this.objectService.getUsers().then(sent =>
      this.userDatabase.refreshData(sent));
  }

}

export class UserDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] { return this.dataChange.value; }

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
export class UserDataSource extends DataSource<any> {
  constructor(private _userDatabase: UserDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    return this._userDatabase.dataChange;
  }

  disconnect() { }
}
