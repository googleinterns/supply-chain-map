import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DashboardComponent } from './dashboard.component';
import { DataTabComponent } from './tabs/data-tab/data-tab.component';
import { StatsTabComponent } from './tabs/stats-tab/stats-tab.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DataTabComponent,
    StatsTabComponent
  ],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
