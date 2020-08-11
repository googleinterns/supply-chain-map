import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult } from '../home.models';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from '../store/selectors';
import { selectDashboardIsLoading, selectDashboardError } from './store/selectors';
import { setDashboardHeight, setSidePanelWidth } from '../store/actions';
import { DashboardHelperService } from './services/dashboard-helper.service';
import { GoogleAuthService } from 'src/app/services/google-auth/google-auth.service';
import { dashboardFetchSuccess, fetchDashboardResult } from './store/actions';

@Component({
  selector: 'scm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  formQueryResult$: Observable<FormQueryResult>;
  isLoading$: Observable<boolean>;
  error$: Observable<Error>;
  hasRiskAccess: boolean;

  constructor(private store: Store, public dashboardHelperService: DashboardHelperService, private googleAuthService: GoogleAuthService) {
    this.store.dispatch(fetchDashboardResult());
    this.isLoading$ = this.store.select(selectDashboardIsLoading);
    this.error$ = this.store.select(selectDashboardError);

    this.googleAuthService.getProfileData()
      .then(user => {
        this.hasRiskAccess = dashboardHelperService.hasAccessToRiskDashboard(user.email);
      });
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);
  }

  goFullScreen() {
    this.store.dispatch(setDashboardHeight({ dashboardHeight: Infinity }));
    this.store.dispatch(setSidePanelWidth({ sidePanelWidth: 0 }));
  }
}
