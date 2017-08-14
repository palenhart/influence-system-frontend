import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { InfluenceDetailsComponent } from '../influence-details/influence-details.component';

import { Corporateer } from '../corporateer';
import { User } from '../user';
import { CorporateerService } from '../services/corporateer.service';
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  corporateer: Corporateer;

  constructor(
    private authService: AuthService,
  private corporateerService: CorporateerService) { }

  ngOnInit() {
    this.corporateerService.getCurrentCorporateer().then(corporateer => this.corporateer = corporateer);
  }

}
