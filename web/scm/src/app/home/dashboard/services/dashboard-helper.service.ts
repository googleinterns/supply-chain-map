import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { data } from './mock_data';

@Injectable({
    providedIn: 'root'
})
export class DashboardHelperService {

    constructor(private bigQueryService: BigQueryService) { }

    private readonly SQL_LAYER_QUERY = `
    SELECT
        ARRAY(
            SELECT TABLE_NAME FROM ${environment.bigQuery.layerDatasets.heatmap.dataset}.INFORMATION_SCHEMA.TABLES
        ) as heatmap_layers,
        ARRAY(
            SELECT TABLE_NAME FROM ${environment.bigQuery.layerDatasets.shape.dataset}.INFORMATION_SCHEMA.TABLES
        ) as shape_layers
    `;

    async getAdditionalLayers() {
        const layers = {
            heatmap: [],
            shape: []
        };
        try {
            //const response = await this.bigQueryService.runQuery(this.SQL_LAYER_QUERY);
            const result = this.bigQueryService.convertResult(data);
            layers.heatmap = result[0].heatmap_layers;
            layers.shape = result[0].shape_layers;

            return layers;
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
        }

        return layers;
    }
}
