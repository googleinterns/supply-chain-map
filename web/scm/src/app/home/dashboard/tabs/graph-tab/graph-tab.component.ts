import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateChartComponent } from './create-chart-dialog/create-chart.dialog';
import { FormQueryResult } from 'src/app/home/home.models';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import { selectDashboardData } from '../../store/selectors';

@Component({
  selector: 'scm-graph-tab',
  templateUrl: './graph-tab.component.html',
  styleUrls: ['./graph-tab.component.scss']
})
export class GraphTabComponent implements OnInit {

  dashboardResult$: Observable<FormQueryResult>;
  charts: {
    chart: any,
    data: any,
    chartOptions: any,
    identifier: any
  }[] = [];
  dialogRef: MatDialogRef<CreateChartComponent>;
  chinaOnlyChartData: { name: string, series: { name: string, value: number }[] }[];
  pieChartData: { name: string, value: number }[];
  donutChartData: { name: string, value: number }[];

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    dashboardHelperService: DashboardHelperService
  ) {
    this.dashboardResult$ = this.store.select(selectDashboardData);
    this.dashboardResult$.subscribe(
      formQueryResult => {
        if (!formQueryResult) {
          return;
        }
        this.chinaOnlyChartData = dashboardHelperService.getChartOne(formQueryResult);
        this.pieChartData = dashboardHelperService.getPieChart(formQueryResult);
        this.donutChartData = dashboardHelperService.getDonutChart(formQueryResult);
      }
    );
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialogRef = this.matDialog.open(CreateChartComponent, { disableClose: true });

    this.dialogRef.afterClosed().subscribe(formValue => {
      this.dialogRef = undefined;
      this.createChart(formValue);
    });
  }

  /**
   * The method creates a chart and adds it to the  @var charts array.
   * Since the formQueryResult will keep changing, we subscribe to 
   * @param formValue The value obtained after the user submitted the form
   */
  createChart(formValue: {
        analyzeTableSelect: string,
        groupBySelect: string,
        nameSelect: string,
        valueSelect: string,
        chartTypeSelect: any,
        chartOptions: any
      }) {
    if (!formValue) {
      return;
    }

    const key$ = d => d[formValue.groupBySelect ? formValue.groupBySelect : formValue.nameSelect];
    const name$ = d => d[formValue.nameSelect];
    const value$ = d => d[formValue.valueSelect];

    const chartsInsertLoc = this.charts.length;

    this.dashboardResult$.subscribe(
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
