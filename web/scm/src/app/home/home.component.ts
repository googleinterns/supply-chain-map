import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectHomeIsLoading, selectHomeError } from './store/selectors';

@Component({
  selector: 'scm-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isLoading$: Observable<boolean>;
  error$: Observable<Error>;

  constructor(private store: Store) {
    this.isLoading$ = this.store.select(selectHomeIsLoading);
    this.error$ = this.store.select(selectHomeError);
  }
}
