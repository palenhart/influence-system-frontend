import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';
import { MdSnackBar } from '@angular/material';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { AppSettings } from '../app-settings';
import { Corporateer } from '../corporateer';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { AuthService } from "../services/auth.service";
import { Division } from '../division';
@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {
  
  corporateerCtrl: FormControl;
  divisionCtrl: FormControl;
  addCtrl: FormControl;

  filteredMembers: any;


  corporateers: Corporateer[];
  currentCorporateer = new Corporateer;
  corporateer: string;
  divisions: Division[];
  division: string;
  add: boolean;


  types =[
    { value: true, viewValue: 'Add to' },
    { value: false, viewValue: 'Remove from' }
  ]

  membershipForm: FormGroup;

  constructor(public dialog: MdDialog, private authService: AuthService, private corporateerService: CorporateerService, private objectService: ObjectService, private snackBar: MdSnackBar) {
    this.corporateerCtrl = new FormControl('', [
      Validators.required
    ]);

    this.divisionCtrl = new FormControl('', [
      Validators.required
    ]);

    this.addCtrl = new FormControl('', [
      Validators.required
    ]);

    this.membershipForm = new FormGroup({
      'corporateerCtrl': this.corporateerCtrl,
      'divisionCtrl': this.divisionCtrl,
      'addCtrl': this.addCtrl
    });

    this.filteredMembers = this.corporateerCtrl.valueChanges
    .startWith(null)
    .map(name => this.filterMembers(name));
   }
  
   sendMembershipChange() {
    
        this.corporateerService.changeCorporateerDivisionMembership(this.corporateer, this.division, this.add)
          .then(response => {
            this.openSnackBar("Division membership changed successfully");
            this.corporateerService.getCurrentCorporateer().then(corporateer => this.currentCorporateer = corporateer);
          })
          .catch(error => {
            var reason = JSON.parse(error._body).message;
            this.openSnackBar(reason);
          });
      }



  filterMembers(val: string) {
   if (val && val.length > 1) {
     return val ? this.corporateers.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) >= 0)
        : this.corporateers;
    }
  }
  ngOnInit() {
    this.objectService.getCorporateers().then(corporateers => this.corporateers = corporateers);
    this.objectService.getDivisions().then(divisions => this.divisions = divisions.filter(division => division.name != "none" || division.department.name == "none"));
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}
