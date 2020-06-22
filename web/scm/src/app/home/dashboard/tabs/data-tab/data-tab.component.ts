import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { FormQueryResult, FormQueryUpstreamResult, FormQueryCmResult, FormQueryDownstreamResult } from 'src/app/home/home.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectHomeFormQuery, selectHomeFormQueryResult } from 'src/app/home/store/selectors';

@Component({
  selector: 'scm-data-tab',
  templateUrl: './data-tab.component.html',
  styleUrls: ['./data-tab.component.scss']
})
export class DataTabComponent {
  formQueryResult$: Observable<FormQueryResult>;

  upstreamDataSource: MatTableDataSource<FormQueryUpstreamResult>;
  upstreamColumns: string[];
  cmDataSource: MatTableDataSource<FormQueryCmResult>;
  cmColumns: string[];
  downstreamDataSource: MatTableDataSource<FormQueryDownstreamResult>;
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
    const upstreamSample: FormQueryUpstreamResult = {
      product: '',
      parent_sku: '',
      part_number: '',
      description: '',
      category: '',
      supplier_name: '',
      lead_time: '',
      mfg_city: '',
      mfg_state: '',
      mfg_country: '',
      mfg_lat: 0,
      mfg_long: 0
    };
    this.upstreamColumns = Object.values(Object.keys(upstreamSample));
    const cmSample: FormQueryCmResult = {
      product: '',
      sku: '',
      description: '',
      cm_name: '',
      lead_time: '',
      cm_city: '',
      cm_state: '',
      cm_country: '',
      cm_lat: 0,
      cm_long: 0
    };
    this.cmColumns = Object.values(Object.keys(cmSample));
    const downstreamSample: FormQueryDownstreamResult = {
      product: '',
      sku: '',
      gdc_code: '',
      lead_time: '',
      gdc_city: '',
      gdc_state: '',
      gdc_country: '',
      gdc_lat: 0,
      gdc_long: 0
    };
    this.downstreamColumns = Object.values(Object.keys(downstreamSample));

    /**
     * Using subscribe method instead of async pipe because we
     * need it as a MatTableDataSource
     */
    this.formQueryResult$.subscribe(
      formQueryResult => {
        if (formQueryResult) {
          this.upstreamDataSource = new MatTableDataSource(formQueryResult.upstream);
          this.cmDataSource = new MatTableDataSource(formQueryResult.cm);
          this.downstreamDataSource = new MatTableDataSource(formQueryResult.downstream);
        }
      }
    );
  }

}
