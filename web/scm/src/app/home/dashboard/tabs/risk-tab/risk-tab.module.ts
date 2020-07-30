import { NgModule } from '@angular/core';
import { RiskTabComponent } from './risk-tab.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromRisk from './store/reducers';
import { CommonModule } from '@angular/common';
import { RiskStoreEffects } from './store/effects';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HighLevelComponent } from './high-level/high-level.component';
import { SupplierBasedComponent } from './supplier-based/supplier-based.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MitigationComponent } from './mitigation/mitigation.component';

@NgModule({
    declarations: [
        RiskTabComponent,
        HighLevelComponent,
        SupplierBasedComponent,
        MitigationComponent
    ],
    imports: [
        CommonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        NgxDatatableModule,
        NgxChartsModule,
        StoreModule.forFeature('risk', fromRisk.reducer),
        EffectsModule.forFeature([RiskStoreEffects])
    ],
    exports: [
        RiskTabComponent
    ]
})
export class RiskTabModule { }
