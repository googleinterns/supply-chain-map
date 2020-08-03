import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { constants } from 'src/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectRiskQueryResult } from '../store/selectors';
import { RiskTabHelperService } from '../services/risk-tab-helper.service';

@Component({
    selector: 'scm-high-level',
    templateUrl: './high-level.component.html',
    styleUrls: ['./high-level.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighLevelComponent {

    readonly RISK_COLS = constants.bigQuery.datasets.risk.columns;

    ColumnMode = ColumnMode;
    pieChartColorScheme = {
        domain: ['#eff7ff', '#cfe2f3', '#3d85c6', '#073763']
    };
    heatmapColorScheme = {
        domain: ['#EFEFEF', '#F2C1C1', '#E68484', '#C95B5B']
    };
    heatmapColumns = [
        { name: '', prop: 'dimension', sortable: false },
        { name: 'High', prop: 'High', sortable: false },
        { name: 'Significant', prop: 'Significant', sortable: false },
        { name: 'Medium', prop: 'Medium', sortable: false },
        { name: 'Low', prop: 'Low', sortable: false }
    ];
    supplierRiskColumns = [
        { name: 'Supplier', prop: this.RISK_COLS.SUPPLIER_NAME, sortable: true },
        { name: 'Concentration', prop: this.RISK_COLS.CONCENTRATION, sortable: true },
        { name: 'Dependence', prop: this.RISK_COLS.DEPENDENCE, sortable: true },
        { name: 'Price', prop: this.RISK_COLS.PRICE, sortable: true },
        { name: 'Financial Health', prop: this.RISK_COLS.FINANCIAL_HEALTH, sortable: true },
        { name: 'Contractual', prop: this.RISK_COLS.CONTRACTUAL, sortable: true },
        { name: 'Compliance', prop: this.RISK_COLS.COMPLIANCE_WITH_SUSTAINABILITY, sortable: true },
        { name: 'Geopolitical', prop: this.RISK_COLS.GEOPOLITICAL, sortable: true },
        { name: 'Confidentiality', prop: this.RISK_COLS.CONFIDENTIALITY, sortable: true },
        { name: 'Quality', prop: this.RISK_COLS.QUALITY, sortable: true },
    ];
    riskQueryResult: any[];
    supplierRiskData: any[];
    pieChartCountData: { name: string, value: number }[];
    pieChartSpendData: { name: string, value: number }[];
    heatMapData: { name: string, series: { name: string, value: number }[] }[];

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    public constructor(private store: Store, public riskTabHelper: RiskTabHelperService) {
        this.store.select(selectRiskQueryResult).subscribe(
            riskQueryResult => {
                const t = riskQueryResult.slice();
                t.sort((a, b) => {
                    if (a[this.RISK_COLS.PRIORITY] > b[this.RISK_COLS.PRIORITY]) {
                        return 1;
                    } else if (a[this.RISK_COLS.PRIORITY] < b[this.RISK_COLS.PRIORITY]) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                this.riskQueryResult = t;
                this.pieChartCountData = this.toCountPieChart(riskQueryResult);
                this.pieChartSpendData = this.toSpendPieChart(riskQueryResult);
                this.heatMapData = this.toHeatMap(riskQueryResult);
                this.supplierRiskData = t;
            }
        );
    }

    selectSupplier(supplierName) {
        if (supplierName) {
            this.supplierRiskData = [this.riskQueryResult.find(row => row[this.RISK_COLS.SUPPLIER_NAME] === supplierName)];
        } else {
            this.supplierRiskData = this.riskQueryResult;
        }
    }

    getSuppplierRiskCellClass({ row, column, value }): any {
        const classes = {
            cell: true
        };
        if (column.name === 'Supplier') {
            classes[row['Priority']] = true;
        } else {
            classes[value] = true;
        }
        return classes;
    }

    getHeatmapCellClass({ column, value }): any {
        const classes = {
            cell: true
        };
        if ((column.name === 'High' || column.name === 'Significant') && parseInt(value, 10) > 0) {
            classes[column.name] = true;
        } else if (column.prop !== 'dimension') {
            classes['Disabled'] = true;
        }
        return classes;
    }

    private toCountPieChart(riskQueryResult: any[]): { name: string, value: number }[] {
        const arrayMap = [];

        for (const row of riskQueryResult) {
            if (!(row[this.RISK_COLS.PRIORITY] in arrayMap)) {
                arrayMap[row[this.RISK_COLS.PRIORITY]] = 0;
            }
            arrayMap[row[this.RISK_COLS.PRIORITY]]++;
        }
        return Object.entries(arrayMap).map(([key, value]) => ({ name: key, value: value }));
    }

    private toSpendPieChart(riskQueryResult: any[]): { name: string, value: number }[] {
        const arrayMap = [];

        for (const row of riskQueryResult) {
            if (!(row[this.RISK_COLS.PRIORITY] in arrayMap)) {
                arrayMap[row[this.RISK_COLS.PRIORITY]] = 0;
            }
            arrayMap[row[this.RISK_COLS.PRIORITY]] += parseFloat(row[this.RISK_COLS.SPEND_IN_MIL]);
        }
        return Object.entries(arrayMap).map(([key, value]) => ({ name: key, value: value }));
    }

    private toHeatMap(riskQueryResult: any[]): { name: string, series: { name: string, value: number }[] }[] {
        const dimensions = this.riskTabHelper.getDimensions();
        const arrayMap = [];
        for (const col of ['High', 'Significant', 'Medium', 'Low']) {

            arrayMap.push({
                name: col,
                series: Object.keys(dimensions).map(dimension => {
                    const count = riskQueryResult.reduce((acc, row) => row[dimension] === col ? acc + 1 : acc, 0);
                    return {
                        name: dimensions[dimension],
                        value: count
                    };
                })
            });
        }

        return arrayMap;
    }
}
