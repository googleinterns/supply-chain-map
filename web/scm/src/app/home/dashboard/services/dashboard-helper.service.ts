import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardHelperService {

    constructor(private bigQueryService: BigQueryService) { }

    private readonly SQL_LAYER_QUERY = `
        SELECT TABLE_NAME FROM ${environment.bigQuery.layerDataset}.INFORMATION_SCHEMA.TABLES
    `;

    async getAdditionalLayers() {
        const layers: string[] = [];
        try {
            const response = await this.bigQueryService.runQuery(this.SQL_LAYER_QUERY);

            for (const tableRow of response.result.rows) {
                layers.push(tableRow.f[0].v);
            }
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
        }

        return layers;
    }
}
