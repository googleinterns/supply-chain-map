import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DashboardHelperService } from '../../services/dashboard-helper.service';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';

@Component({
  selector: 'scm-graph-tab',
  templateUrl: './graph-tab.component.html',
  styleUrls: ['./graph-tab.component.scss']
})
export class GraphTabComponent implements OnInit {

  chartOne: any;

  constructor(
    private store: Store,
    private dashboardHelperService: DashboardHelperService,
    private changeDetector: ChangeDetectorRef
    ) {
  }

  ngOnInit(): void {
    this.store.select(selectHomeFormQueryResult).subscribe(
      formQueryResult => {
        this.chartOne = this.dashboardHelperService.getChartOne(formQueryResult);
        this.changeDetector.detectChanges();
      }
    );
  }

}
