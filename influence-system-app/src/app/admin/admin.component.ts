import { Component, OnInit } from '@angular/core';
import { CorporateerService } from '../services/corporateer.service';
import { AuthService } from "../services/auth.service";

import { User } from '../user';
import { Corporateer } from '../corporateer';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthService,
    private corporateerService: CorporateerService) { }

  ngOnInit() {
  }

  distributeTributes() {
    this.corporateerService.distributeTributes();
  }

}
