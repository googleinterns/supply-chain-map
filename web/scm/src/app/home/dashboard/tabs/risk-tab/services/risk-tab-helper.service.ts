import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { constants } from 'src/constants';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RiskTabHelperService {

    constructor(private bigQueryService: BigQueryService) {

    }

    public async getRiskData() {
        const RISK_SQL = `
            SELECT ${Object.values(constants.bigQuery.datasets.risk.columns).join(', ')}
            FROM ${constants.bigQuery.datasets.risk.table}
        `;

        try {
            const response = await this.bigQueryService.runQuery(RISK_SQL);
            const result = this.bigQueryService.convertResult(response.result);

            return result;
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
            throw new Error('Failed to fetch risk data');
        }
    }

    public getDimensions() {
        const RISK_COLS = constants.bigQuery.datasets.risk.columns;
        const dimensions = {};
        dimensions[RISK_COLS.CONCENTRATION] = 'Concentration';
        dimensions[RISK_COLS.DEPENDENCE] = 'Dependence';
        dimensions[RISK_COLS.PRICE] = 'Price';
        dimensions[RISK_COLS.FINANCIAL_HEALTH] = 'Financial Health';
        dimensions[RISK_COLS.CONTRACTUAL] = 'Contractual';
        dimensions[RISK_COLS.COMPLIANCE_WITH_SUSTAINABILITY] = 'Compliance with Sustainability';
        dimensions[RISK_COLS.GEOPOLITICAL] = 'Geopolitcal';
        dimensions[RISK_COLS.CONFIDENTIALITY] = 'Confidentiality';
        dimensions[RISK_COLS.QUALITY] = 'Quality';
        return dimensions;
    }

}
