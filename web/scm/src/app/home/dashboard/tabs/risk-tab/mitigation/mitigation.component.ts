import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RiskTabHelperService } from '../services/risk-tab-helper.service';
import { selectRiskQueryResult } from '../store/selectors';
import { constants } from 'src/constants';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
    selector: 'scm-mitigation',
    templateUrl: './mitigation.component.html',
    styleUrls: ['./mitigation.component.scss']
})
export class MitigationComponent {

    readonly RISK_COLS = constants.bigQuery.datasets.risk.columns;
    readonly dimensions = this.riskTabHelper.getDimensions();

    ColumnMode = ColumnMode;
    riskQueryResult: any[];
    mitigationTableData: any[];
    mitigationColumns = [
        { name: 'Suppliers', prop: this.RISK_COLS.SUPPLIER_NAME },
        { name: 'DRI', prop: this.RISK_COLS.DRI },
        { name: 'Risk Category', prop: 'dimension' },
        { name: 'Risk Rating', prop: 'rating' },
        { name: 'Mitigation Plan', prop: 'mitigationPlan' },
        { name: 'Timeline/ETA', prop: 'timeline' },
        { name: 'Status', prop: 'status' }
    ]

    public constructor(private store: Store, private riskTabHelper: RiskTabHelperService) {
        this.store.select(selectRiskQueryResult).subscribe(
            riskQueryResult => {
                this.riskQueryResult = riskQueryResult;
                this.mitigationTableData = this.getMitigationTable(riskQueryResult);;
            }
        );
    }

    private getMitigationTable(riskQueryResult: any[]) {
        const rows = [];

        for (const row of riskQueryResult) {
            const line = {};
            line[this.RISK_COLS.SUPPLIER_NAME] = row[this.RISK_COLS.SUPPLIER_NAME];
            line[this.RISK_COLS.DRI] = row[this.RISK_COLS.DRI];
            for (const dimension of Object.keys(this.dimensions)) {
                rows.push({
                    ...line,
                    dimension: this.dimensions[dimension],
                    rating: row[dimension],
                    mitigationPlan: '',
                    timeline: '',
                    status: ''
                });
            }
        }

        return rows;
    }

    mitigationFilter(segmentationEl, supplierNameEl) {
        this.mitigationTableData = this.getMitigationTable(this.riskQueryResult.filter(
            row => {
                const segmentFilter = segmentationEl && segmentationEl.value ? row[this.RISK_COLS.SEGMENTATION] === segmentationEl.value : true;
                const supplierFilter = supplierNameEl && supplierNameEl.value ? row[this.RISK_COLS.SUPPLIER_NAME] === supplierNameEl.value : true;
                return segmentFilter && supplierFilter;
            }
        ));
    }

    getMitigationCellClass({ row, column, value }): any {
        const classes = {
            cell: true
        };
        if (column.prop === 'rating') {
            classes[value] = true;
        } else {
            classes['Disabled'] = true;
        }
        return classes;
    }
}
