import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult } from '../home.models';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from '../store/selectors';
import { selectDashboardIsLoading, selectDashboardError } from './store/selectors';
import { setDashboardHeight, setSidePanelWidth } from '../store/actions';

@Component({
  selector: 'scm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  receivedData = false;
  formQueryResult$: Observable<FormQueryResult>;
  isLoading$: Observable<boolean>;
  error$: Observable<Error>;

  constructor(private store: Store) {
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);
    this.isLoading$ = this.store.select(selectDashboardIsLoading);
    this.error$ = this.store.select(selectDashboardError);

    this.formQueryResult$.subscribe(
      formQueryResult => {
        if (formQueryResult) {
          this.receivedData = true;
        } else {
          this.receivedData = false;
        }
      }
    );
  }

  goFullScreen() {
    this.store.dispatch(setDashboardHeight({ dashboardHeight: Infinity }));
    this.store.dispatch(setSidePanelWidth({ sidePanelWidth: 0 }));
  }
}
