import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectRiskQueryResult } from '../store/selectors';
import { constants } from 'src/constants';
import { RiskTabHelperService } from '../services/risk-tab-helper.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector: 'scm-supplier-based',
    templateUrl: './supplier-based.component.html',
    styleUrls: ['./supplier-based.component.scss']
})
export class SupplierBasedComponent {

    ColumnMode = ColumnMode;
    readonly RISK_COLS = constants.bigQuery.datasets.risk.columns;
    readonly dimensions = this.riskTabHelper.getDimensions();

    supplierRiskHeatmap: any[];
    heatmapColumns = [
        { name: 'Types of risks', prop: 'risk', sortable: false },
        { name: 'Low', prop: 'low', sortable: false },
        { name: 'Medium', prop: 'medium', sortable: false },
        { name: 'Significant', prop: 'significant', sortable: false },
        { name: 'High', prop: 'high', sortable: false }
    ];
    riskQueryResult: any[];
    selectedSupplier: any;
    supplierStackedRisk: { name: string, series: { name: string, value: number }[] }[];
    supplierStackLegend = [
        { title: 'High', iconColor: '#C95B5B' },
        { title: 'Significant', iconColor: '#E68484' },
        { title: 'Medium', iconColor: '#B7B7B7' },
        { title: 'Low', iconColor: '#EFEFEF' }
    ];

    public constructor(private store: Store, private riskTabHelper: RiskTabHelperService) {
        this.store.select(selectRiskQueryResult).subscribe(
            riskQueryResult => {
                this.riskQueryResult = riskQueryResult;
            }
        );
    }

    selectSupplier(supplierName) {
        this.selectedSupplier = this.riskQueryResult.find(row => row[this.RISK_COLS.SUPPLIER_NAME] === supplierName);

        const count = {};
        count['Low'] = 0;
        count['Medium'] = 0;
        count['Significant'] = 0;
        count['High'] = 0;

        for (const dimension of Object.keys(this.dimensions)) {
            if (this.selectedSupplier[dimension]) {
                count[this.selectedSupplier[dimension]] += 1;
            }
        }

        this.supplierStackedRisk = [{
            name: supplierName,
            series: Object.keys(count).map(name => ({ name: name, value: count[name] }))
        }];

        this.supplierRiskHeatmap = Object.keys(this.dimensions).map(dimension => ({
            risk: this.dimensions[dimension],
            low: '',
            medium: '',
            significant: '',
            high: '',
            riskColName: dimension,
            val: this.selectedSupplier[dimension]
        }));
    }

    heatmapCellClass({ row, column, value }): any {
        const classes = {
            cell: true,
            centerLabel: true
        };
        if (column.name === row.val) {
            classes[column.name] = true;
        } else if (column.prop !== 'risk') {
            classes['Disabled'] = true;
        }
        return classes;
    }
}
