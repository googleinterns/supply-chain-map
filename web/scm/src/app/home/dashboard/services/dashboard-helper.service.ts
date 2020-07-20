import { Injectable } from '@angular/core';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { constants } from 'src/constants';
import { environment } from 'src/environments/environment';
import { FormQueryResult } from '../../home.models';

@Injectable({
    providedIn: 'root'
})
export class DashboardHelperService {

    constructor(private bigQueryService: BigQueryService) { }

    /**
     * Helper method that fetches a list
     * of all the additional layers that are
     * available by getting all the table names
     * from the dataset.
     */
    async getAdditionalLayers(): Promise<{ heatmap: string[], shape: string[] }> {
        const SQL_LAYER_QUERY = `
            SELECT
                ARRAY(
                    SELECT TABLE_NAME FROM ${constants.bigQuery.layerDatasets.heatmap.dataset}.INFORMATION_SCHEMA.TABLES
                ) as heatmap_layers,
                ARRAY(
                    SELECT TABLE_NAME FROM ${constants.bigQuery.layerDatasets.shape.dataset}.INFORMATION_SCHEMA.TABLES
                ) as shape_layers
            `;
        const layers = {
            heatmap: [],
            shape: []
        };
        try {
            const response = await this.bigQueryService.runQuery(SQL_LAYER_QUERY);
            const result = this.bigQueryService.convertResult(response.result);
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

    /**
     * Create a basic chart that maps the total amount of parts
     * obtained from China and non-China sources.
     * @param formQueryResult The result obtained from submitting the form
     */
    getChartOne(formQueryResult: FormQueryResult) {
        const UPSTREAM_COLS = constants.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
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
