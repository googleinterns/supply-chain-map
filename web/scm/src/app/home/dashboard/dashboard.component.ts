import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult } from '../home.models';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from '../store/selectors';

@Component({
  selector: 'scm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  receivedData = false;
  formQueryResult$: Observable<FormQueryResult>;

  constructor(private store: Store) {
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);

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
}
