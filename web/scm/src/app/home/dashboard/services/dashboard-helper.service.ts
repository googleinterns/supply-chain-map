import { Injectable } from '@angular/core';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { constants } from 'src/constants';
import { environment } from 'src/environments/environment';
import { FormQueryResult, FormQueryResultStats, FormQueryResponse } from '../../home.models';

@Injectable({
    providedIn: 'root'
})
export class DashboardHelperService {

    UPSTREAM_COLS = constants.bigQuery.datasets.route.tables.UPSTREAM.columns;
    DOWNSTREAM_COLS = constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns;
    CM_COLS = constants.bigQuery.datasets.route.tables.CM.columns;

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
                    SELECT TABLE_NAME FROM ${constants.bigQuery.datasets.heatmap.dataset}.INFORMATION_SCHEMA.TABLES
                ) as heatmap_layers,
                ARRAY(
                    SELECT TABLE_NAME FROM ${constants.bigQuery.datasets.shape.dataset}.INFORMATION_SCHEMA.TABLES
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
     * Get data to populat dashboard tabs
     */
    async getDashboardData(): Promise<FormQueryResponse> {
        const UPSTREAM_COLUMNS = Object.values(constants.bigQuery.datasets.route.tables.UPSTREAM.columns);
        const DOWNSTREAM_COLUMNS = Object.values(constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns);
        const CM_COLUMNS = Object.values(constants.bigQuery.datasets.route.tables.CM.columns);
        const query = `
        SELECT ARRAY(
            SELECT AS STRUCT
                ${UPSTREAM_COLUMNS.join(', ')}
            FROM
                ${constants.bigQuery.datasets.route.tables.UPSTREAM.tableName}
        ) AS upstream ,
        ARRAY(
            SELECT AS STRUCT
                ${DOWNSTREAM_COLUMNS.join(', ')}
            FROM
                ${constants.bigQuery.datasets.route.tables.DOWNSTREAM.tableName}
        ) AS downstream ,
        ARRAY(
            SELECT AS STRUCT
                ${CM_COLUMNS.join(', ')}
            FROM
                ${constants.bigQuery.datasets.route.tables.CM.tableName}
        ) AS cm `;
        const request = await this.bigQueryService.runQuery(query);
        const formattedResult = this.bigQueryService.convertResult(request.result)[0];

        /**
         * Get other stats from response
         */
        const formQueryResultStats: FormQueryResultStats = {
            projectId: request.result.jobReference.projectId,
            jobId: request.result.jobReference.jobId,
            totalBytesProcessed: request.result.totalBytesProcessed,
            jobComplete: request.result.jobComplete,
            cacheHit: request.result.cacheHit

        };
        return {
            formQueryResult: formattedResult,
            formQueryResultStats: formQueryResultStats
        };
    }

    /**
     * Create a basic chart that maps the total amount of parts
     * obtained from China and non-China sources.
     * @param formQueryResult The result obtained from submitting the form
     */
    getChartOne(formQueryResult: FormQueryResult): { name: string, series: { name: string, value: number }[] }[] {
        const UPSTREAM_COLS = constants.bigQuery.datasets.route.tables.UPSTREAM.columns;
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
                    name: '% of BOM sourced from China (Cost)',
                    value: value.chinaCost * 100 / value.totalCost
                }, {
                    name: '% of BOM sourced from China (Count)',
                    value: value.chinaUnits * 100 / value.totalUnits
                }]
            });
        }

        return result;
    }

    getPieChart(formQueryResult: FormQueryResult): { name: string, value: number }[] {
        const arrayMap: { [key: string]: number } = {};

        for (const row of formQueryResult.upstream) {
            if (!(row[this.UPSTREAM_COLS.COUNTRY_OF_ORIGIN] in arrayMap)) {
                arrayMap[row[this.UPSTREAM_COLS.COUNTRY_OF_ORIGIN]] = 0;
            }
            arrayMap[row[this.UPSTREAM_COLS.COUNTRY_OF_ORIGIN]]++;
        }

        function ValueObject(name: string, value: number) {
            this.name = name;
            this.value = value;
            this.valueOf = () => value;
        }

        return Object.entries(arrayMap).map(([key, value]) => new ValueObject(key, value));
    }

    getDonutChart(formQueryResult: FormQueryResult): { name: string, value: number }[] {
        const arrayMap: { [key: string]: number } = {};

        for (const row of formQueryResult.upstream) {
            if (row[this.UPSTREAM_COLS.COUNTRY_OF_ORIGIN] !== 'China') {
                continue;
            }
            if (!(row[this.UPSTREAM_COLS.CATEGORY] in arrayMap)) {
                arrayMap[row[this.UPSTREAM_COLS.CATEGORY]] = 0;
            }
            arrayMap[row[this.UPSTREAM_COLS.CATEGORY]]++;
        }

        function ValueObject(name: string, value: number) {
            this.name = name;
            this.value = value;
            this.valueOf = () => value;
        }

        return Object.entries(arrayMap).map(([key, value]) => new ValueObject(key, value));
    }

    hasAccessToRiskDashboard(email: string): boolean {
        const allowedEmails = [
            'aaggrim@google.com',
            'burkebai@google.com',
            'daniton@google.com',
            'kerstinteng@google.com',
            'kmalfred@google.com',
            'reganjin@google.com',
            'xuehua@google.com',
            'mstonich@google.com',
            'vandas@google.com',
            'daniton@google.com',
            'darrenward@google.com',
            'liemj@google.com',
            'aqn@google.com',
            'nirup@google.com'
        ];

        return allowedEmails.includes(email);
    }
}
