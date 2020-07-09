import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { MatDialog } from '@angular/material/dialog';
import { CreateChartComponent } from './create-chart-dialog/create-chart.dialog';
import { FormQueryResult } from 'src/app/home/home.models';

@Component({
  selector: 'scm-graph-tab',
  templateUrl: './graph-tab.component.html',
  styleUrls: ['./graph-tab.component.scss']
})
export class GraphTabComponent implements OnInit {

  formQueryResult$: Observable<FormQueryResult>;
  charts = [];

  constructor(
    private store: Store,
    private matDialog: MatDialog
  ) {
    this.formQueryResult$ = this.store.select(selectHomeFormQueryResult);
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.matDialog.open(CreateChartComponent);

    dialogRef.afterClosed().subscribe(
      formValue => this.processData(formValue)
    );
  }

  processData(formValue) {
    console.log(formValue);
    if (!formValue.analyzeTableSelect) {
      return;
    }
    const key$ = d => d[formValue.groupBySelect];
    const name$ = d => d[formValue.nameSelect];
    const value$ = d => d[formValue.valueSelect];

    const chartsInsertLoc = this.charts.length;


    this.formQueryResult$.subscribe(
      formQueryResult => {
        const nestedData = nest(formQueryResult);
        this.charts[chartsInsertLoc] = {
          chart: formValue.chartTypeSelect,
          data: nestedData.map(
            d => ({
              name: d.key,
              series: rollUp(d.value.map(seriesPoints))
            })
          ),
          chartOptions: formValue.chartOptions
        };
      }
    );

    function seriesPoints(d) {
      return {
        name: name$(d),
        value: value$(d)
      };
    }

    function nest(formQueryResult: FormQueryResult) {
      const arrayMap = [];

      for (const row of formQueryResult[formValue.analyzeTableSelect]) {
        if (!(key$(row) in arrayMap)) {
          arrayMap[key$(row)] = [];
        }
        arrayMap[key$(row)].push(row);
      }
      return Object.keys(arrayMap).map(key => ({ key: key, value: arrayMap[key] }));
    }

    function rollUp(arr): any[] {
      const arrayMap = [];
      for (const obj of arr) {
        if (!(obj.name in arrayMap)) {
          arrayMap[obj.name] = 0;
        }
        arrayMap[obj.name] += parseFloat(obj.value) ?? 0;
      }

      return Object.keys(arrayMap).map(name => ({ name: name, value: arrayMap[name] }));
    }
  }

}
