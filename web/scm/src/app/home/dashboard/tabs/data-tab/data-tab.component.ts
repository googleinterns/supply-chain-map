import { Component, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult } from 'src/app/home/home.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { constants } from 'src/constants';

@Component({
  selector: 'scm-data-tab',
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.scss']
})
export class DataTabComponent {
  formQueryResult$: Observable<FormQueryResult>;

  shouldDisplayUpstream = false;
  shouldDisplayDownstream = false;

  upstreamDataSource: MatTableDataSource<object>;
  upstreamColumns: string[];
  cmDataSource: MatTableDataSource<object>;
  cmColumns: string[];
  downstreamDataSource: MatTableDataSource<object>;
  downstreamColumns: string[];

  @ViewChildren(MatPaginator)
  set paginatorSetter(content: QueryList<MatPaginator>) {
    const paginatorArray = content.toArray();
    // Since popping, reverse order
    if (this.downstreamDataSource) {
      this.downstreamDataSource.paginator = paginatorArray.pop();
    }
    this.cmDataSource.paginator = paginatorArray.pop();
    if (this.upstreamDataSource) {
      this.upstreamDataSource.paginator = paginatorArray.pop();
    }
  }
  @ViewChildren(MatSort)
  set sortSetter(content: QueryList<MatSort>) {
    const sortArray = content.toArray();
    // Since popping, reverse order
    if (this.downstreamDataSource) {
      this.downstreamDataSource.sort = sortArray.pop();
    }
    this.cmDataSource.sort = sortArray.pop();
    if (this.upstreamDataSource) {
      this.upstreamDataSource.sort = sortArray.pop();
    }
  }

  constructor(private store: Store) {
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);

    /**
     * Set up column names by declaring empty objects
     * and retreiving the keys
     */
    this.upstreamColumns = Object.values(constants.bigQuery.datasets.route.tables.UPSTREAM.columns);
    this.cmColumns = Object.values(constants.bigQuery.datasets.route.tables.CM.columns);
    this.downstreamColumns = Object.values(constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns);

    /**
     * Using subscribe method instead of async pipe because we
     * need it as a MatTableDataSource
     */
    this.formQueryResult$.subscribe(
      formQueryResult => {
        if (formQueryResult) {
          if ('upstream' in formQueryResult) {
            if (this.upstreamDataSource) {
              this.upstreamDataSource.data = formQueryResult.upstream;
            } else {
              this.upstreamDataSource = new MatTableDataSource(formQueryResult.upstream);
            }
            this.shouldDisplayUpstream = true;
          } else {
            this.shouldDisplayUpstream = false;
          }

          if (this.cmDataSource) {
            this.cmDataSource.data = formQueryResult.cm;
          } else {
            this.cmDataSource = new MatTableDataSource(formQueryResult.cm);
          }

          if ('downstream' in formQueryResult) {
            if (this.downstreamDataSource) {
              this.downstreamDataSource.data = formQueryResult.downstream;
            } else {
              this.downstreamDataSource = new MatTableDataSource(formQueryResult.downstream);
            }
            this.shouldDisplayDownstream = true;
          } else {
            this.shouldDisplayDownstream = false;
          }
        }
      }
    );
  }

}
