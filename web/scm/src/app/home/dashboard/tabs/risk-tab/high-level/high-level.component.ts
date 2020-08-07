import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { constants } from 'src/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { selectRiskQueryResult } from '../store/selectors';
import { RiskTabHelperService } from '../services/risk-tab-helper.service';
import * as d3 from 'd3';

@Component({
    selector: 'scm-high-level',
    templateUrl: './high-level.component.html',
    styleUrls: ['./high-level.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighLevelComponent {

    readonly RISK_COLS = constants.bigQuery.datasets.risk.columns;

    ColumnMode = ColumnMode;
    priorityLegend = [
        { title: 'P0', iconColor: '#073763' },
        { title: 'P1', iconColor: '#3d85c6' },
        { title: 'P2', iconColor: '#cfe2f3' },
        { title: 'P3', iconColor: '#eff7ff' }
    ];
    riskLegend = [
        { title: 'High', iconColor: '#C95B5B' },
        { title: 'Significant', iconColor: '#E68484' },
        { title: 'Medium', iconColor: '#B7B7B7' },
        { title: 'Low', iconColor: '#EFEFEF' }
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
    pieChartCountData: { name: string, value: number, valueOf: () => number }[];
    pieChartSpendData: { name: string, value: number }[];
    segmentationStackedRisk: { name: string, series: { name: string, value: number }[] }[];

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
                this.supplierRiskData = t;
                this.segmentationStackedRisk = this.toSegmentationStackedRisk(riskQueryResult);
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

    selectSupplierCountSegmentation(segmentation) {
        this.pieChartCountData = this.toCountPieChart(
            this.riskQueryResult.filter(row => segmentation ? row[this.RISK_COLS.SEGMENTATION] === segmentation : true)
        );
    }

    selectSupplierSpendSegmentation(segmentation) {
        this.pieChartSpendData = this.toSpendPieChart(
            this.riskQueryResult.filter(row => segmentation ? row[this.RISK_COLS.SEGMENTATION] === segmentation : true)
        );
    }

    supplierRiskFilter(segmentationEl, supplierNameEl) {
        this.supplierRiskData = this.riskQueryResult.filter(
            row => {
                const segmentFilter = segmentationEl && segmentationEl.value ? row[this.RISK_COLS.SEGMENTATION] === segmentationEl.value : true;
                const supplierFilter = supplierNameEl && supplierNameEl.value ? row[this.RISK_COLS.SUPPLIER_NAME] === supplierNameEl.value : true;
                return segmentFilter && supplierFilter;
            }
        );
    }

    private toSegmentationStackedRisk(riskQueryResult: any[]): { name: string, series: { name: string, value: number }[] }[] {

        const arrayMap = {};
        for (const row of riskQueryResult) {
            if (!(row[this.RISK_COLS.SEGMENTATION] in arrayMap)) {
                arrayMap[row[this.RISK_COLS.SEGMENTATION]] = {
                    Low: 0,
                    Medium: 0,
                    Significant: 0,
                    High: 0
                };
            }
            arrayMap[row[this.RISK_COLS.SEGMENTATION]][row[this.RISK_COLS.OVERALL_RISK]] += 1;
        }

        return Object.keys(arrayMap).map(segmentation => ({
            name: segmentation,
            series: Object.keys(arrayMap[segmentation]).map(risk => ({
                name: risk,
                value: arrayMap[segmentation][risk]
            }))
        }));
    }

    private toCountPieChart(riskQueryResult: any[]): { name: string, value: number, valueOf: () => number }[] {
        const arrayMap: { [key: string]: number } = {};

        for (const row of riskQueryResult) {
            if (!(row[this.RISK_COLS.PRIORITY] in arrayMap)) {
                arrayMap[row[this.RISK_COLS.PRIORITY]] = 0;
            }
            arrayMap[row[this.RISK_COLS.PRIORITY]]++;
        }

        function ValueObject(name: string, value: number) {
            this.name = name;
            this.value = value;
            this.valueOf = () => value;
        }

        return Object.entries(arrayMap).map(([key, value]) => new ValueObject(key, value));
    }

    private toSpendPieChart(riskQueryResult: any[]): { name: string, value: number }[] {
        const arrayMap = [];

        for (const row of riskQueryResult) {
            if (!(row[this.RISK_COLS.PRIORITY] in arrayMap)) {
                arrayMap[row[this.RISK_COLS.PRIORITY]] = 0;
            }
            arrayMap[row[this.RISK_COLS.PRIORITY]] += parseFloat(row[this.RISK_COLS.SPEND_IN_MIL]);
        }

        function ValueObject(name: string, value: number) {
            this.name = name;
            this.value = value;
            this.valueOf = () => value;
        }

        return Object.entries(arrayMap).map(([key, value]) => new ValueObject(key, value));
    }
}
