import { Component } from '@angular/core';
import { chartTypes } from './chart-types';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'scm-create-chart-dialog',
    templateUrl: './create-chart.dialog.html',
    styleUrls: ['./create-chart.dialog.scss']
})
export class CreateChartComponent {

    chartTypes = chartTypes;
    tables = [];
    selectedTable: string;
    createChartFormGroup: FormGroup;
    defaultOptions = {
        showLegend: true,
        legendTitle: 'Legend',
        gradient: false,
        showXAxis: true,
        showYAxis: true,
        showXAxisLabel: true,
        showYAxisLabel: true,
        yAxisLabel: '',
        xAxisLabel: '',
        showGridLines: true,
        showSeriesOnHover: true
    };

    constructor(private store: Store, private dialogRef: MatDialogRef<CreateChartComponent>) {
        this.createChartFormGroup = new FormGroup({
            chartTypeSelect: new FormControl('', Validators.required),
            analyzeTableSelect: new FormControl('', Validators.required),
            groupBySelect: new FormControl('', Validators.required),
            nameSelect: new FormControl('', Validators.required),
            valueSelect: new FormControl('', Validators.required)
        });

        this.store.select(selectHomeFormQueryResult)
            .subscribe(
                formQueryResult => {
                    if (formQueryResult) {
                        if ('upstream' in formQueryResult) {
                            this.tables['upstream'] = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
                        }
                        if ('downstream' in formQueryResult) {
                            this.tables['downstream'] = environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns;
                        }
                    }
                }
            );
    }

    submitForm() {
        if (this.createChartFormGroup.invalid) {
            this.createChartFormGroup.markAllAsTouched();
            return;
        }
        const formValue = this.createChartFormGroup.value;
        this.dialogRef.close({
            ...formValue,
            chartOptions: {
                ...this.defaultOptions,
                xAxisLabel: formValue.nameSelect,
                yAxisLabel: formValue.valueSelect
            }
        });
    }
}
