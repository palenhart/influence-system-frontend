import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdChipsModule,
  MdTableModule,
  MdDatepickerModule,
  MdDialogModule,
  MdExpansionModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdNativeDateModule,
  MdPaginatorModule,
  MdProgressBarModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSliderModule,
  MdSlideToggleModule,
  MdSnackBarModule,
  MdSortModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  StyleModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionComponent } from './transaction/transaction.component';
import { CorporateerService } from './services/corporateer.service'
import { TransactionHistoryService } from './services/transaction-history.service'
import { AppRoutingModule } from './app-routing-module/app-routing-module.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfluenceDetailsComponent } from './influence-details/influence-details.component';
import { LoginFormComponent } from './auth/login-form/login-form.component';
import { AuthService } from './services/auth.service';
import { ObjectService } from './services/object.service';
import { TransactionService } from './services/transaction.service';
import { AuthGuard } from './services/auth-guard.service';
import { AdminGuard } from './services/admin-guard.service';
import { AdminComponent } from './admin/admin.component';
import { NewUserDialog } from './admin/admin.component';
import { ChangePasswordDialog } from './user-settings/user-settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HistoryComponent } from './history/history.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserlistComponent } from './userlist/userlist.component';
import { AllTransactionsComponent } from './all-transactions/all-transactions.component';
import { ShopComponent } from './shop/shop.component';
import { LogsComponent } from './logs/logs.component';
import { DivisionsComponent } from './divisions/divisions.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MembershipComponent } from './membership/membership.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { BidAuctionComponent } from './bid-auction/bid-auction.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    TransactionComponent,
    WelcomeComponent,
    InfluenceDetailsComponent,
    LoginFormComponent,
    AdminComponent,
    NewUserDialog,
    ChangePasswordDialog,
    NotFoundComponent,
    ForbiddenComponent,
    HistoryComponent,
    UserSettingsComponent,
    UserlistComponent,
    AllTransactionsComponent,
    ShopComponent,
    LogsComponent,
    DivisionsComponent,
    ConfirmationDialogComponent,
    MembershipComponent,
    CreateAuctionComponent,
    BidAuctionComponent,
  ],
  entryComponents: [
    NewUserDialog,
    ConfirmationDialogComponent,
    ChangePasswordDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdButtonToggleModule,
    MdCardModule,
    MdCheckboxModule,
    MdChipsModule,
    MdTableModule,
    MdDatepickerModule,
    MdDialogModule,
    MdExpansionModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdMenuModule,
    MdPaginatorModule,
    MdProgressBarModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdRippleModule,
    MdSelectModule,
    MdSidenavModule,
    MdSlideToggleModule,
    MdSliderModule,
    MdSnackBarModule,
    MdSortModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MdNativeDateModule,
    StyleModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    CdkTableModule
  ],
  providers: [CorporateerService, AuthService, ObjectService, TransactionHistoryService, TransactionService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
