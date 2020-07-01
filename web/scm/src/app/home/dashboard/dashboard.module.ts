import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardComponent } from './dashboard.component';
import { DataTabComponent } from './tabs/data-tab/data-tab.component';
import { StatsTabComponent } from './tabs/stats-tab/stats-tab.component';
import { MapTabComponent } from './tabs/map-tab/map-tab.component';
import * as fromDashboard from './store/reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DashboardStoreEffects } from './store/effects';
import { SelectLayerComponent } from './tabs/map-tab/select-layer-dialog/select-layer.dialog';
import { MatSortModule } from '@angular/material/sort';
import { GraphTabComponent } from './tabs/graph-tab/graph-tab.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SelectLayerComponent,
    DataTabComponent,
    StatsTabComponent,
    MapTabComponent,
    GraphTabComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    NgxChartsModule,
    StoreModule.forFeature('dashboard', fromDashboard.reducer),
    EffectsModule.forFeature([DashboardStoreEffects])
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
