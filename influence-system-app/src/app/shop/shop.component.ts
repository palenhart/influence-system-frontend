import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { Influence } from '../influence';
import { Corporateer } from '../corporateer';
import { Rank } from '../rank';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  model: any = {};
  error = '';
  waiting = false;

  ranks: Rank[];
  rank = new Rank(0);
  influence = new Influence("none", "none", 0);

  currentCorporateer: Corporateer;
  division: string;

  rankCtrl: FormControl;
  priceCtrl: FormControl;

  buyRankForm: FormGroup;

  constructor(private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService, private snackBar: MdSnackBar) {
    this.rankCtrl = new FormControl('', [
      Validators.required
    ]),
      this.priceCtrl = new FormControl({ value: '0', disabled: true }, [
        Validators.required
      ]),
      this.buyRankForm = new FormGroup({
        'rankCtrl': this.rankCtrl,
        'priceCtrl': this.priceCtrl
      });
  }

  ngOnInit() {
    this.corporateerService.getCurrentCorporateer().then(corporateer => {
      this.currentCorporateer = corporateer;
      this.objectService.getRanks().then(ranks => {
        this.ranks = ranks.filter(rank => rank.buyingAllowed == true).filter(rank => rank.level > this.currentCorporateer.rank.level)
      });
    });
    this.corporateerService.getCurrentInfluence().then(influences => {
      this.influence = influences.find(influence => influence.department == 'none' && influence.division == 'none');
    });
  }

  private updateInfluencePrice() {

    if (this.influence.amount < this.rank.influenceToBuy) {

      this.rankCtrl.setErrors({
        "max": true
      });
    }
  }

  buyRank() {
    this.waiting = true;
    this.corporateerService.buyRank(this.rank)
      .then(response => {
        this.openSnackBar("Rank successfully bought")
        this.corporateerService.getCurrentCorporateer().then(corporateer => {
          this.currentCorporateer = corporateer;
          this.corporateerService.getCurrentInfluence().then(influences => {
            this.influence = influences.find(influence => influence.department == 'none' && influence.division == 'none');
          });
          this.objectService.getRanks().then(ranks => {
            this.ranks = ranks.filter(rank => rank.buyingAllowed == true).filter(rank => rank.level > this.currentCorporateer.rank.level);
          });
          this.waiting = false;
        });
      })
      .catch(error => {
        var reason = JSON.parse(error._body).reason;
        this.openSnackBar(reason);
      });
    this.rank = new Rank(0);
    //this.buyRankForm.reset();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}
