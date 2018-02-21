import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { MdDialog } from '@angular/material';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../services/auth.service';
import { CorporateerService } from '../services/corporateer.service';
import { ObjectService } from '../services/object.service';
import { Influence } from '../influence';
import { Corporateer } from '../corporateer';
import { Rank } from '../rank';
import { Auction } from '../auction';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  now: any;
  model: any = {};
  error = '';
  waiting = false;

  ranks: Rank[];
  rank = new Rank(0);
  influence = new Influence("none", "none", 0);

  currentCorporateer: Corporateer;

  rankCtrl: FormControl;
  priceCtrl: FormControl;

  buyRankForm: FormGroup;

  //
  // Influence conversion
  //
  influences: Influence[];
  influenceToConvert = new Influence("none", "none", 0);
  amount: number;
  toGeneral = false;

  divisionCtrl: FormControl;
  toGeneralCtrl: FormControl;
  amountCtrl: FormControl;

  influenceGeneralizationForm: FormGroup;

  //
  // Auctions
  //
  auctions: Auction[];
  auctionToBid: Auction;
  bidAmount: number;

  auctionCtrl: FormControl;
  bidAmountCtrl: FormControl;

  auctionBiddingForm: FormGroup;

  constructor(public dialog: MdDialog, private authService: AuthService, private objectService: ObjectService, private corporateerService: CorporateerService, private snackBar: MdSnackBar) {
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

      this.divisionCtrl = new FormControl('', [
        Validators.required
      ]),
        this.toGeneralCtrl = new FormControl('', [
          Validators.required
        ]),
        this.amountCtrl = new FormControl('', [
          Validators.required,
          Validators.pattern(/^[-]?[0-9]+$/),
          Validators.max(this.influenceToConvert.amount),
          Validators.min(1)
        ]),
        this.influenceGeneralizationForm = new FormGroup({
          'divisionCtrl': this.divisionCtrl,
          'toGeneralCtrl': this.toGeneralCtrl,
          'amountCtrl': this.amountCtrl
        });

        this.auctionCtrl = new FormControl('', [
          Validators.required
        ]),
           this.bidAmountCtrl = new FormControl('', [
            Validators.required,
            Validators.pattern(/^[-]?[0-9]+$/),
            Validators.min(1)
          ]),
          this.auctionBiddingForm = new FormGroup({
            'auctionCtrl': this.auctionCtrl,
            'bidAmountCtrl': this.bidAmountCtrl
          });
  }

  ngOnInit() {
    this.now = Date.now();
    this.corporateerService.getCurrentCorporateer().then(corporateer => {
      this.currentCorporateer = corporateer;
      this.objectService.getRanks().then(ranks => {
        this.ranks = ranks.filter(rank => rank.buyingAllowed == true).filter(rank => rank.rankLevel > this.currentCorporateer.rank.rankLevel)
      });
    });
    this.corporateerService.getCurrentInfluence().then(influences => {
      this.influence = influences.find(influence => influence.department == 'none' && influence.division == 'none');
      this.influences = influences.filter(influence => influence.department != "none").filter(influence => influence.amount != 0);
    });
    this.objectService.getAuctions().then(auctions => {
      this.auctions = auctions.filter(auction => Date.parse(auction.beginningTimestamp) < this.now).filter(auction => Date.parse(auction.endingTimestamp) > this.now)
    });
    
    
    //this.corporateerService.getCurrentInfluence().then(influences => {
    //  this.influences = influences.filter(influence => influence.department != "none").filter(influence => influence.amount != 0)
    //});
  }

  private updateInfluencePrice() {

    if (this.influence.amount < this.rank.influenceToBuy) {

      this.rankCtrl.setErrors({
        "max": true
      });
    }
  }

  confirmBuyRank(): void {
    var confirmationMessage;
    confirmationMessage = "Do you want to buy the rank " + this.rank.name + " for " + this.rank.influenceToBuy + " influence?";

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { confirmationMessage: confirmationMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buyRank();
      }
    });
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
            this.ranks = ranks.filter(rank => rank.buyingAllowed == true).filter(rank => rank.rankLevel > this.currentCorporateer.rank.rankLevel);
          });
          this.waiting = false;
        });
      })
      .catch(error => {
        var reason = JSON.parse(error._body).message;
        this.openSnackBar(reason);
      });
    this.rank = new Rank(0);
    //this.buyRankForm.reset();
  }

  private updateInfluenceAmount() {
    this.amountCtrl.setValidators([
      Validators.pattern(/^[-]?[0-9]+$/),
      Validators.max(this.influenceToConvert.amount),
      Validators.min(1),
      Validators.required]);
    this.amountCtrl.updateValueAndValidity();
    this.amountCtrl.reset();

    this.toGeneralCtrl.setValue(this.toGeneral);
    this.toGeneralCtrl.updateValueAndValidity();
  }

  private updateInfluenceToBidAmount() {
    this.bidAmountCtrl.setValidators([
      Validators.pattern(/^[-]?[0-9]+$/),
      Validators.min(this.auctionToBid.currentBid + this.auctionToBid.minStep),
      Validators.required]);
    this.bidAmountCtrl.updateValueAndValidity();
    this.bidAmountCtrl.reset();
  }

  confirmConvertInfluence(): void {
    var confirmationMessage;
    if (this.toGeneral || this.influenceToConvert.division == 'none') {
      confirmationMessage = "Do you want to convert " + this.amount + " influence from " + this.influenceToConvert.department + "||" + this.influenceToConvert.division + " to general influence?";
    }
    else {
      confirmationMessage = "Do you want to convert " + this.amount + " influence from " + this.influenceToConvert.department + "||" + this.influenceToConvert.division + " to department influence?";
    }
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { confirmationMessage: confirmationMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.convertInfluence();
      }
    });
  }

  convertInfluence() {
    this.waiting = true;
    var influenceToRequestConversion = new Influence(this.influenceToConvert.division, this.influenceToConvert.department, this.amount);
    this.corporateerService.convertInfluence(influenceToRequestConversion, this.toGeneral)
      .then(response => {
        this.openSnackBar("Influence successfully converted")
        this.corporateerService.getCurrentInfluence().then(influences => {
          this.influences = influences.filter(influence => influence.department != "none").filter(influence => influence.amount != 0);
          this.influenceToConvert = new Influence("none", "none", 0);
          this.toGeneral = false;
          this.waiting = false;
        });
      })
      .catch(error => {
        var reason = JSON.parse(error._body).message;
        this.openSnackBar(reason);
      });
    this.influenceGeneralizationForm.reset();
  }

  confirmBidInfluence(): void {
    var confirmationMessage;
      confirmationMessage = "Do you want to bid " + this.bidAmount + " influence on the auction " + this.auctionToBid.title + "?";
    
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { confirmationMessage: confirmationMessage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bidInfluence();
      }
    });
  }

  bidInfluence() {
    this.waiting = true;
    this.objectService.placeBid(this.auctionToBid, this.bidAmount)
      .then(response => {
        this.openSnackBar(JSON.parse(response.text()).message)
        this.objectService.getAuctions().then(auctions => {
          this.auctions = auctions.filter(auction => Date.parse(auction.beginningTimestamp) < this.now).filter(auction => Date.parse(auction.endingTimestamp) > this.now)
          this.waiting = false;
        });
      })
      .catch(error => {
        var reason = JSON.parse(error._body).message;
        this.openSnackBar(reason);
      });
    this.auctionBiddingForm.reset();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

}
