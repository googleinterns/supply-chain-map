import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

import { BasicFilterComponent } from './basic-filter/basic-filter.component';
import { CmFilterComponent } from './cm-filter/cm-filter.component';
import { DownstreamFilterComponent } from './downstream-filter/downstream-filter.component';
import { SidePanelComponent } from './side-panel.component';
import { UpstreamFilterComponent } from './upstream-filter/upstream-filter.component';



@NgModule({
  declarations: [
    BasicFilterComponent,
    CmFilterComponent,
    DownstreamFilterComponent,
    SidePanelComponent,
    UpstreamFilterComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  exports: [
    BasicFilterComponent,
    CmFilterComponent,
    DownstreamFilterComponent,
    SidePanelComponent,
    UpstreamFilterComponent
  ]
})
export class SidePanelModule { }
