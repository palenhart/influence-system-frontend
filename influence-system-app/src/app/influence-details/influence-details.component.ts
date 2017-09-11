import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { ObjectService } from '../services/object.service';
import { AuthService } from '../services/auth.service';
import { CorporateerService } from '../services/corporateer.service';
import { Influence } from '../influence';

@Component({
  selector: 'app-influence-details',
  templateUrl: './influence-details.component.html',
  styleUrls: ['./influence-details.component.css']
})
export class InfluenceDetailsComponent implements OnInit {
  public isCollapsed = true;

  displayedInfluenceColumns = ['department', 'division', 'amount'];
  influenceDatabase = new InfluenceDatabase();
  influenceDataSource: InfluenceDataSource | null;

  constructor(private corporateerService: CorporateerService) {

  }

  ngOnInit() {
    this.influenceDataSource = new InfluenceDataSource(this.influenceDatabase);
    this.corporateerService.getCurrentInfluence().then(influences =>
      this.influenceDatabase.refreshData(influences.filter(influence => influence.amount > 0)));
  }
}

export class InfluenceDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Influence[]> = new BehaviorSubject<Influence[]>([]);
  get data(): Influence[] { return this.dataChange.value; }

  constructor() {
    this.dataChange.next(this.data);
  }

  refreshData(influences) {
    this.dataChange.next(influences);
  }
}

export class InfluenceDataSource extends DataSource<any> {
  constructor(private _influenceDatabase: InfluenceDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Influence[]> {
    return this._influenceDatabase.dataChange;
  }

  disconnect() { }
}