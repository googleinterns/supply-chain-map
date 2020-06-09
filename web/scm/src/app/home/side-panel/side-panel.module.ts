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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { BasicFilterComponent } from './filters/basic-filter/basic-filter.component';
import { CmFilterComponent } from './filters/cm-filter/cm-filter.component';
import { DownstreamFilterComponent } from './filters/downstream-filter/downstream-filter.component';
import { SidePanelComponent } from './side-panel.component';
import { SidePanelStoreEffects } from './store/effects';
import { UpstreamFilterComponent } from './filters/upstream-filter/upstream-filter.component';
import * as fromSidePanel from './store/reducers';



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
    ReactiveFormsModule,
    StoreModule.forFeature('sidePanel', fromSidePanel.reducer),
    EffectsModule.forFeature([SidePanelStoreEffects])
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
