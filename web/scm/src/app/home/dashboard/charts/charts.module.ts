import { NgModule } from '@angular/core';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ShapeLegendComponent } from './shape-legend/shape-legend.component';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
    declarations: [
        BarChartComponent,
        PieChartComponent,
        ShapeLegendComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        BarChartComponent,
        PieChartComponent,
        ShapeLegendComponent
    ]
})
export class ChartsModule {}
