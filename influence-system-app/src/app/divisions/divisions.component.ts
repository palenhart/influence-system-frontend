import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { Division } from '../division';
import { ObjectService } from '../services/object.service';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.css']
})
export class DivisionsComponent implements OnInit {

  displayedDivisionColumns = ['name', 'department', 'members', 'influence'];
  divisionDatabase = new DivisionDatabase();
  divisionDataSource: DivisionDataSource | null;

  constructor(private objectService: ObjectService) { }

  ngOnInit() {
    this.divisionDataSource = new DivisionDataSource(this.divisionDatabase);
    this.objectService.getDivisions().then(divisions =>
      this.divisionDatabase.refreshData(divisions.filter(division => division.name != 'none')));
  }

}

export class DivisionDatabase {
  dataChange: BehaviorSubject<Division[]> = new BehaviorSubject<Division[]>([]);
  get data(): Division[] { return this.dataChange.value; }

  constructor() {
    this.dataChange.next(this.data);
  }

  refreshData(divisions) {
    this.dataChange.next(divisions);
  }


}
export class DivisionDataSource extends DataSource<any> {
  constructor(private _divisionDatabase: DivisionDatabase) {
    super();
  }

  connect(): Observable<Division[]> {
    return this._divisionDatabase.dataChange;
  }

  disconnect() { }
}
