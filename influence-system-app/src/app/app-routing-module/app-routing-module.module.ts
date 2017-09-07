import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from '../profile/profile.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { TransactionComponent } from '../transaction/transaction.component';
import { HistoryComponent } from '../history/history.component';
import { AdminComponent } from '../admin/admin.component';
import { InfluenceConversionComponent } from '../influence-conversion/influence-conversion.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserlistComponent } from '../userlist/userlist.component';
import { AllTransactionsComponent } from '../all-transactions/all-transactions.component';
import { LoginFormComponent } from '../auth/login-form/login-form.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ForbiddenComponent } from '../forbidden/forbidden.component';
import { AuthGuard } from '../services/auth-guard.service';
import { AdminGuard } from '../services/admin-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'transaction', component: TransactionComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'conversion', component: InfluenceConversionComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'users', component: UserlistComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'transactions', component: AllTransactionsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'login', component: LoginFormComponent },
  { path: '404', component: NotFoundComponent },
  { path: '403', component: ForbiddenComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
