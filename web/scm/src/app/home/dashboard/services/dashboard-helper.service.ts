import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { FormQueryResult } from '../../home.models';
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
            // const response = await this.bigQueryService.runQuery(this.SQL_LAYER_QUERY);
            const result = this.bigQueryService.convertResult(data);
            layers.heatmap = result[0].heatmap_layers;
            layers.shape = result[0].shape_layers;

            return layers;
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
            throw new Error('Failed to fetch layers');
        }
    }

    getChartOne(formQueryResult: FormQueryResult) {
        const UPSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
        const result: {
            name: string,
            series: {
                name: string,
                value: number
            }[]
        }[] = [];
        const seenProduct = [];
        for (const upstream of formQueryResult.upstream) {
            if (!(upstream[UPSTREAM_COLS.PRODUCT] in seenProduct)) {
                seenProduct[upstream[UPSTREAM_COLS.PRODUCT]] = {
                    chinaUnits: 0,
                    totalUnits: 0,
                    chinaCost: 0,
                    totalCost: 0
                };
            }
            const _totalQty = parseFloat(upstream[UPSTREAM_COLS.TOTAL_QTY]);
            const _unitCost = parseFloat(upstream[UPSTREAM_COLS.UNIT_COST]);
            if (upstream[UPSTREAM_COLS.MFG_COUNTRY].toUpperCase() === 'CHINA') {
                seenProduct[upstream[UPSTREAM_COLS.PRODUCT]].chinaUnits += _totalQty;
                seenProduct[upstream[UPSTREAM_COLS.PRODUCT]].chinaCost += _unitCost * _totalQty;
            }
            seenProduct[upstream[UPSTREAM_COLS.PRODUCT]].totalUnits += _totalQty;
            seenProduct[upstream[UPSTREAM_COLS.PRODUCT]].totalCost += _unitCost * _totalQty;
        }

        for (const [product, value] of Object.entries(seenProduct)) {
            result.push({
                name: product,
                series: [{
                    name: 'chinaCost',
                    value: value.chinaCost / value.totalCost
                }, {
                    name: 'chinaUnits',
                    value: value.chinaUnits / value.totalUnits
                }]
            });
        }

        return result;
    }
}
