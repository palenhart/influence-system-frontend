import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

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

  currentInfluence: Influence[];

  constructor(private http: Http, private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService) {

  }

  ngOnInit() {

  }
}
