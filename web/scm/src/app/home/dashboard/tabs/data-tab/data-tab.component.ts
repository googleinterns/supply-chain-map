import { Component, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult } from 'src/app/home/home.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { constants } from 'src/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'scm-data-tab',
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.scss']
})
export class DataTabComponent {

  ColumnMode = ColumnMode;
  formQueryResult$: Observable<FormQueryResult>;

  /**
   * Set up column names by declaring empty objects
   * and retreiving the keys
   */
  upstreamColumns = Object.keys(constants.bigQuery.datasets.route.tables.UPSTREAM.columns).map(
    key => ({
      name: key.replace('_', ' ').toLowerCase(),
      prop: constants.bigQuery.datasets.route.tables.UPSTREAM.columns[key]
    })
  );
  cmColumns = Object.keys(constants.bigQuery.datasets.route.tables.CM.columns).map(
    key => ({
      name: key.replace('_', ' ').toLowerCase(),
      prop: constants.bigQuery.datasets.route.tables.CM.columns[key]
    })
  );
  downstreamColumns = Object.keys(constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns).map(
    key => ({
      name: key.replace('_', ' ').toLowerCase(),
      prop: constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns[key]
    })
  );

  constructor(private store: Store) {
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);
  }

}
