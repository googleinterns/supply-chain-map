import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult } from 'src/app/home/home.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'scm-data-tab',
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.scss']
})
export class DataTabComponent {
  formQueryResult$: Observable<FormQueryResult>;

  upstreamDataSource: MatTableDataSource<object>;
  upstreamColumns: string[];
  cmDataSource: MatTableDataSource<object>;
  cmColumns: string[];
  downstreamDataSource: MatTableDataSource<object>;
  downstreamColumns: string[];

  @ViewChildren(MatPaginator)
  set paginatorSetter(content: QueryList<MatPaginator>) {
    const paginatorArray = content.toArray();
    this.upstreamDataSource.paginator = paginatorArray[0];
    this.cmDataSource.paginator = paginatorArray[1];
    this.downstreamDataSource.paginator = paginatorArray[2];
  }
  @ViewChildren(MatSort)
  set sortSetter(content: QueryList<MatSort>) {
    const sortArray = content.toArray();
    this.upstreamDataSource.sort = sortArray[0];
    this.cmDataSource.sort = sortArray[1];
    this.downstreamDataSource.sort = sortArray[2];
  }

  constructor(private store: Store) {
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);

    /**
     * Set up column names by declaring empty objects
     * and retreiving the keys
     */
    this.upstreamColumns = Object.values(environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns);
    this.cmColumns = Object.values(environment.bigQuery.layerDatasets.route.tables.CM.columns);
    this.downstreamColumns = Object.values(environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns);

    /**
     * Using subscribe method instead of async pipe because we
     * need it as a MatTableDataSource
     */
    this.formQueryResult$.subscribe(
      formQueryResult => {
        if (formQueryResult) {
          if (this.upstreamDataSource) {
            this.upstreamDataSource.data = formQueryResult.upstream;
          } else {
            this.upstreamDataSource = new MatTableDataSource(formQueryResult.upstream);
          }

          if (this.cmDataSource) {
            this.cmDataSource.data = formQueryResult.cm;
          } else {
            this.cmDataSource = new MatTableDataSource(formQueryResult.cm);
          }

          if (this.downstreamDataSource) {
            this.downstreamDataSource.data = formQueryResult.downstream;
          } else {
            this.downstreamDataSource = new MatTableDataSource(formQueryResult.downstream);
          }
        }
      }
    );
  }

}
