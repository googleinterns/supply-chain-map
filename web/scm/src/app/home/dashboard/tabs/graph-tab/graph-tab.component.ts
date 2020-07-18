import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
    const dialogRef = this.matDialog.open(CreateChartComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(formValue => this.processData(formValue));
  }

  processData(formValue) {
    if (!formValue) {
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
            keyvalue => ({
              name: keyvalue.key,
              series: rollUp(keyvalue.value.map(row => ({ name: name$(row), value: value$(row) })))
            })
          ),
          chartOptions: formValue.chartOptions,
          identifier: Date.now()
        };
        // ngx-charts has a resize issue. Must explicitly call resize.
        window.dispatchEvent(new Event('resize'));
      }
    );

    function nest(formQueryResult: FormQueryResult): { key: string, value: any[] }[] {
      const arrayMap = [];

      for (const row of formQueryResult[formValue.analyzeTableSelect]) {
        if (!(key$(row) in arrayMap)) {
          arrayMap[key$(row)] = [];
        }
        arrayMap[key$(row)].push(row);
      }
      return Object.keys(arrayMap).map(key => ({ key: key, value: arrayMap[key] }));
    }

    function rollUp(arr: { name: string, value: string }[]): any[] {
      const floatRollUp = () => {
        const arrayMap = [];
        for (const obj of arr) {
          if (!(obj.name in arrayMap)) {
            arrayMap[obj.name] = 0;
          }
          if (+obj.value !== +obj.value) {
            // FAST ISNUMBER CHECK
            return null;
          }
          arrayMap[obj.name] += parseFloat(obj.value);
        }
        return Object.keys(arrayMap).map(name => ({ name: name, value: arrayMap[name] }));
      };

      const stringRollUp = () => {
        const arrayMap = [];
        for (const obj of arr) {
          if (!(obj.name in arrayMap)) {
            arrayMap[obj.name] = new Set();
          }
          arrayMap[obj.name].add(obj.value);
        }
        return Object.keys(arrayMap).map(name => ({ name: name, value: arrayMap[name].size }));
      };

      return floatRollUp() ?? stringRollUp();

    }
  }

  removeChart(chart) {
    this.charts = this.charts.filter(c => c.identifier !== chart.identifier);
    // ngx-charts has a resize issue. Must explicitly call resize.
    window.dispatchEvent(new Event('resize'));
  }

}
