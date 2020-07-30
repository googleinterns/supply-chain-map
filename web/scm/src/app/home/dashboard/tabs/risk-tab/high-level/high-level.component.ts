import { Component, ViewChild } from '@angular/core';
import { constants } from 'src/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectRiskQueryResult } from '../store/selectors';
import { RiskTabHelperService } from '../services/risk-tab-helper.service';

@Component({
    selector: 'scm-high-level',
    templateUrl: './high-level.component.html',
    styleUrls: ['./high-level.component.scss']
})
export class HighLevelComponent {

    readonly RISK_COLS = constants.bigQuery.datasets.risk.columns;

    ColumnMode = ColumnMode;
    pieChartColorScheme = {
        domain: ['#eff7ff', '#cfe2f3', '#3d85c6', '#073763']
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
    pieChartCountData: { name: string, value: number }[];
    pieChartSpendData: { name: string, value: number }[];
    heatMapData: { name: string, series: { name: string, value: number }[] }[];

    @ViewChild(MatSort, { static: true }) sort: MatSort;

    public constructor(private store: Store, private riskTabHelper: RiskTabHelperService) {
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
            }
        );
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
        for (const dimension of Object.values(dimensions)) {
            arrayMap.push({
                dimension: dimension,
                High: 0,
                Significant: 0,
                Medium: 0,
                Low: 0
            });
        }

        let total = 0;
        for (const row of riskQueryResult) {
            let i = 0;
            for (const key of Object.keys(dimensions)) {
                arrayMap[i][row[key]] += 1;
                i++;
                total++;
            }
        }

        for (let i = 0; i < arrayMap.length; i++) {
            for (const key of ['High', 'Significant', 'Medium', 'Low']) {
                const num = Math.round((arrayMap[i][key] * 100 / total) * 10) / 10;
                arrayMap[i][key] = arrayMap[i][key] + ' (' + num + '%)';
            }
        }

        return arrayMap;
    }
}
