import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectHomeFormQuery, selectHomeFormQueryResultSchema, selectHomeFormQueryResultStats } from 'src/app/home/store/selectors';
import { FormQueryResultSchema, FormQueryResultStats } from 'src/app/home/home.models';

@Component({
  selector: 'scm-stats-tab',
  templateUrl: './stats-tab.component.html',
  styleUrls: ['./stats-tab.component.scss']
})
export class StatsTabComponent implements OnInit {

  formQuery$: Observable<string>;
  formQueryResultSchema$: Observable<FormQueryResultSchema>;
  formQueryResultStats$: Observable<FormQueryResultStats>;

  constructor(private store: Store) {
    this.formQuery$ = this.store.select(selectHomeFormQuery);
    this.formQueryResultSchema$ = this.store.select(selectHomeFormQueryResultSchema);
    this.formQueryResultStats$ = this.store.select(selectHomeFormQueryResultStats);
  }

  ngOnInit(): void {
  }

}
