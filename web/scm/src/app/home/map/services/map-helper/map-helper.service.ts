import { Injectable } from '@angular/core';
import { FormQueryResult } from 'src/app/home/home.models';
import { RouteLayerLine, RouteLayerMarker, Layer, HeatmapLayer, ShapeLayer } from '../../map.models';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { environment } from 'src/environments/environment';
import { Colors } from 'src/assets/colors';
import { createPolygonPath } from './geojson-converter';

@Injectable({
    providedIn: 'root'
})
export class MapHelperService {

    constructor(private bigQueryService: BigQueryService) { }

    /**
     * Map for the type of marker to the path
     * to its svg icon
     */
    public static readonly ICON_MAP = {
        GDC: 'assets/gdc.svg',
        MFG: 'assets/mfg.svg',
        CM: 'assets/cm.svg',
        MFG_CM: 'assets/mfg_cm.svg'
    };

    /**
     * This method identifies the type of layer based
     * on the distinguishing property of the layers'
     * interface. If no such property is found, should
     * throw an error.
     * @param layer The layer to be fetched from the bigquery dataset
     */
    public getLayer(layer: Layer) {
        const layerName = layer.name;
        if ('hotspots' in layer) {
            return this.getHeatmapLayer(layerName);
        } else if ('shapes' in layer) {
            return this.getShapeLayer(layerName);
        }
    }

    /**
     * Restructures the form query result to create representative
     * polyline objects.
     * @param formQueryResult The resut obtained after running the form query
     */
    public createLines(formQueryResult: FormQueryResult): RouteLayerLine[] {
        const skuMap = this.createSkuMap(formQueryResult);
        const lines: RouteLayerLine[] = [];
        const UPSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
        const CM_COLS = environment.bigQuery.layerDatasets.route.tables.CM.columns;
        const DOWNSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns;

        for (const sku of skuMap.keys()) {
            /** Upstream lines */
            for (const upstreamRow of skuMap.get(sku).upstream) {
                for (const cmRow of skuMap.get(sku).cm) {
                    lines.push({
                        from: {
                            latitude: parseFloat(upstreamRow[UPSTREAM_COLS.MFG_LAT]),
                            longitude: parseFloat(upstreamRow[UPSTREAM_COLS.MFG_LONG]),
                            city: upstreamRow[UPSTREAM_COLS.MFG_CITY],
                            state: upstreamRow[UPSTREAM_COLS.MFG_STATE],
                            country: upstreamRow[UPSTREAM_COLS.MFG_COUNTRY]
                        },
                        to: {
                            latitude: parseFloat(cmRow[CM_COLS.CM_LAT]),
                            longitude: parseFloat(cmRow[CM_COLS.CM_LONG]),
                            city: cmRow[CM_COLS.CM_CITY],
                            state: cmRow[CM_COLS.CM_STATE],
                            country: cmRow[CM_COLS.CM_COUNTRY]
                        },
                        type: 'UPSTREAM',
                        color: 'blue'
                    });
                }
            }

            /** Downstream lines */
            for (const cmRow of skuMap.get(sku).cm) {
                for (const downstreamRow of skuMap.get(sku).downstream) {
                    lines.push({
                        from: {
                            latitude: parseFloat(cmRow[CM_COLS.CM_LAT]),
                            longitude: parseFloat(cmRow[CM_COLS.CM_LONG]),
                            city: cmRow[CM_COLS.CM_CITY],
                            state: cmRow[CM_COLS.CM_STATE],
                            country: cmRow[CM_COLS.CM_COUNTRY]
                        },
                        to: {
                            latitude: parseFloat(downstreamRow[DOWNSTREAM_COLS.GDC_LAT]),
                            longitude: parseFloat(downstreamRow[DOWNSTREAM_COLS.GDC_LONG]),
                            city: downstreamRow[DOWNSTREAM_COLS.GDC_CITY],
                            state: downstreamRow[DOWNSTREAM_COLS.GDC_STATE],
                            country: downstreamRow[DOWNSTREAM_COLS.GDC_COUNTRY]
                        },
                        type: 'DOWNSTREAM',
                        color: 'red'
                    });
                }
            }
        }

        return lines;
    }

    /**
     * Restructures the form query result to create representative
     * marker objects.
     * @param formQueryResult The resut obtained after running the form query
     */
    public createMarkerPoints(formQueryResult: FormQueryResult): RouteLayerMarker[] {

        const markers: RouteLayerMarker[] = [];
        const markerMap = this.createLocationToMarkerMap(formQueryResult);
        const UPSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
        const CM_COLS = environment.bigQuery.layerDatasets.route.tables.CM.columns;
        const DOWNSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns;

        for (const latLongId of markerMap.keys()) {
            const marker: RouteLayerMarker = {
                latitude: 0,
                longitude: 0,
                iconUrl: '',
                type: [],
                data: {
                    product: [],
                    sku: [],
                    mpn: [],
                    description: [],
                    category: [],
                    name: [],
                    avgLeadTime: 0,
                    city: '',
                    state: '',
                    country: '',
                }
            };

            for (const dataPoint of markerMap.get(latLongId)) {
                if (dataPoint.type === 'MFG') {
                    marker.type.push('MFG');
                    marker.latitude = dataPoint[UPSTREAM_COLS.MFG_LAT];
                    marker.longitude = dataPoint[UPSTREAM_COLS.MFG_LONG];
                    marker.data.city = dataPoint[UPSTREAM_COLS.MFG_CITY] ?? '';
                    marker.data.state = dataPoint[UPSTREAM_COLS.MFG_STATE] ?? '';
                    marker.data.country = dataPoint[UPSTREAM_COLS.MFG_COUNTRY] ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint[UPSTREAM_COLS.LEAD_TIME], 10);
                    marker.data.product.push(dataPoint[UPSTREAM_COLS.PRODUCT]);
                    marker.data.sku.push(dataPoint[UPSTREAM_COLS.PARENT_SKU]);
                    marker.data.mpn.push(dataPoint[UPSTREAM_COLS.MPN]);
                    marker.data.description.push(dataPoint[UPSTREAM_COLS.DESCRIPTION]);
                    marker.data.category.push(dataPoint[UPSTREAM_COLS.CATEGORY]);
                    marker.data.name.push(dataPoint[UPSTREAM_COLS.SUPPLIER_NAME]);
                } else if (dataPoint.type === 'CM') {
                    marker.type.push('CM');
                    marker.latitude = dataPoint[CM_COLS.CM_LAT];
                    marker.longitude = dataPoint[CM_COLS.CM_LONG];
                    marker.data.city = dataPoint[CM_COLS.CM_CITY] ?? '';
                    marker.data.state = dataPoint[CM_COLS.CM_STATE] ?? '';
                    marker.data.country = dataPoint[CM_COLS.CM_COUNTRY] ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint[CM_COLS.LEAD_TIME], 10);
                    marker.data.product.push(dataPoint[CM_COLS.PRODUCT]);
                    marker.data.sku.push(dataPoint[CM_COLS.SKU]);
                    marker.data.description.push(dataPoint[CM_COLS.DESCRIPTION]);
                    marker.data.name.push(dataPoint[CM_COLS.CM_NAME]);
                } else if (dataPoint.type === 'GDC') {
                    marker.type.push('GDC');
                    marker.latitude = dataPoint[DOWNSTREAM_COLS.GDC_LAT];
                    marker.longitude = dataPoint[DOWNSTREAM_COLS.GDC_LONG];
                    marker.data.city = dataPoint[DOWNSTREAM_COLS.GDC_CITY] ?? '';
                    marker.data.state = dataPoint[DOWNSTREAM_COLS.GDC_STATE] ?? '';
                    marker.data.country = dataPoint[DOWNSTREAM_COLS.GDC_COUNTRY] ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint[DOWNSTREAM_COLS.LEAD_TIME], 10);
                    marker.data.product.push(dataPoint[DOWNSTREAM_COLS.PRODUCT]);
                    marker.data.sku.push(dataPoint[DOWNSTREAM_COLS.SKU]);
                    marker.data.name.push(dataPoint[DOWNSTREAM_COLS.GDC_CODE]);
                }
            }

            marker.data.avgLeadTime /= markerMap.get(latLongId).length;

            marker.type = [...new Set(marker.type)];
            marker.data.product = [...new Set(marker.data.product)];
            marker.data.name = [...new Set(marker.data.name)];
            marker.data.description = [...new Set(marker.data.description)];
            marker.data.category = [...new Set(marker.data.category)];
            marker.data.sku = [...new Set(marker.data.sku)];
            if (marker.data.mpn.length > 0) {
                marker.data.sku = [...new Set(marker.data.mpn)];
            } else {
                delete marker.data.mpn;
            }

            if (marker.type.length === 1) {
                switch (marker.type[0]) {
                    case 'MFG': {
                        marker.iconUrl = MapHelperService.ICON_MAP.MFG;
                        break;
                    }
                    case 'CM': {
                        marker.iconUrl = MapHelperService.ICON_MAP.CM;
                        break;
                    }
                    case 'GDC': {
                        marker.iconUrl = MapHelperService.ICON_MAP.GDC;
                        break;
                    }
                }
            } else if (marker.type.includes('GDC')) {
                marker.iconUrl = MapHelperService.ICON_MAP.GDC;
            } else {
                marker.iconUrl = MapHelperService.ICON_MAP.MFG_CM;
            }

            markers.push(marker);
        }

        return markers;
    }

    private async getHeatmapLayer(layerName: string): Promise<HeatmapLayer> {
        const layerCols = environment.bigQuery.layerDatasets.heatmap.columns;
        const SQL_FETCH_ADDITIONAL_LAYER = `
            SELECT ${layerCols.join(', ')}
            FROM ${environment.bigQuery.layerDatasets.heatmap.dataset}.${layerName}
        `;
        const heatMapColors = [
            'rgba(102, 255, 0, 0)',
            'rgba(102, 255, 0, 1)',
            'rgba(147, 255, 0, 1)',
            'rgba(193, 255, 0, 1)',
            'rgba(238, 255, 0, 1)',
            'rgba(244, 227, 0, 1)',
            'rgba(249, 198, 0, 1)',
            'rgba(255, 170, 0, 1)',
            'rgba(255, 113, 0, 1)',
            'rgba(255, 57, 0, 1)',
            'rgba(255, 0, 0, 1)'
        ];

        try {
            const response = await this.bigQueryService.runQuery(SQL_FETCH_ADDITIONAL_LAYER);
            const markers = this.bigQueryService.convertResult(response.result);
            const magnitudes = markers.map(m => m.magnitude);

            return {
                name: layerName,
                hotspots: markers,
                legend: [{
                    name: markers[0].data.magnitude_desc ?? 'Magnitude',
                    spectrum: {
                        gradientColors: heatMapColors,
                        startLabel: Math.min(...magnitudes),
                        endLabel: Math.max(...magnitudes)
                    }
                }]
            };
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
            throw new Error('Cannot load layer ' + layerName);
        }
    }

    private async getShapeLayer(layerName: string): Promise<ShapeLayer> {
        const layerCols = environment.bigQuery.layerDatasets.shape.columns;
        const SQL_FETCH_ADDITIONAL_LAYER = `
            SELECT ${layerCols.join(', ')}
            FROM ${environment.bigQuery.layerDatasets.shape.dataset}.${layerName}
        `;


        try {
            const response = await this.bigQueryService.runQuery(SQL_FETCH_ADDITIONAL_LAYER);
            const shapes = this.bigQueryService.convertResult(response.result);
            const baseColor = Colors.randomColor();

            let maxMagnitude = -1;
            let minMagnitude = Infinity;
            for (const shape of shapes) {
                maxMagnitude = Math.max(maxMagnitude, shape.magnitude);
                minMagnitude = Math.min(minMagnitude, shape.magnitude);
            }

            const colorMap = [];
            const shapeLayerShapes: {
                shapeOpts: google.maps.PolygonOptions,
                magnitude: number,
                data: any
            }[] = [];
            for (const shape of shapes) {
                if (typeof shape.shape !== 'string') {
                    // Unknown countries with null shape. Do not display
                    continue;
                }
                const shapeJSON = JSON.parse(shape.shape);
                if (!(shape.magnitude in colorMap)) {
                    colorMap[shape.magnitude] = Colors.lightenDarkenColor(
                        baseColor,
                        -50 * (parseFloat(shape.magnitude)) / (maxMagnitude),
                        false
                    );
                }

                if (shapeJSON.type === 'Polygon') {
                    shapeLayerShapes.push({
                        shapeOpts: {
                            paths: createPolygonPath(shapeJSON.coordinates),
                            clickable: true,
                            fillColor: colorMap[shape.magnitude],
                            fillOpacity: 1,
                            strokeWeight: 0.5,
                            strokeColor: colorMap[shape.magnitude]
                        },
                        magnitude: shape.magnitude,
                        data: shape.data
                    });
                } else if (shapeJSON.type === 'MultiPolygon') {
                    for (const coord of shapeJSON.coordinates) {
                        shapeLayerShapes.push({
                            shapeOpts: {
                                paths: createPolygonPath(coord),
                                clickable: true,
                                fillColor: colorMap[shape.magnitude],
                                fillOpacity: 1,
                                strokeWeight: 0.5,
                                strokeColor: colorMap[shape.magnitude]
                            },
                            magnitude: shape.magnitude,
                            data: shape.data
                        });
                    }
                }
            }

            return {
                name: layerName,
                shapes: shapeLayerShapes,
                legend: [{
                    name: shapes[0].data.magnitude_desc ?? 'Magnitude',
                    spectrum: {
                        gradientColors: (Object.keys(colorMap).sort()).map(m => colorMap[m]),
                        startLabel: minMagnitude,
                        endLabel: maxMagnitude
                    }
                }]
            };
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
            throw new Error('Cannot load layer ' + layerName);
        }
    }

    private createLocationToMarkerMap(formQueryResult: FormQueryResult): Map<string, Array<any>> {
        const markerMap = new Map<string, Array<any>>();
        let additionalProps;

        if ('upstream' in formQueryResult) {
            const UPSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
            additionalProps = { type: 'MFG' };
            for (const upstreamRow of formQueryResult.upstream) {
                const id = upstreamRow[UPSTREAM_COLS.MFG_LAT] + ' ' + upstreamRow[UPSTREAM_COLS.MFG_LONG];
                if (markerMap.has(id)) {
                    markerMap.get(id).push({ ...upstreamRow, ...additionalProps });
                } else {
                    markerMap.set(id, [{ ...upstreamRow, ...additionalProps }]);
                }
            }
        }

        const CM_COLS = environment.bigQuery.layerDatasets.route.tables.CM.columns;
        additionalProps = { type: 'CM' };
        for (const cmRow of formQueryResult.cm) {
            const id = cmRow[CM_COLS.CM_LAT] + ' ' + cmRow[CM_COLS.CM_LONG];
            if (markerMap.has(id)) {
                markerMap.get(id).push({ ...cmRow, ...additionalProps });
            } else {
                markerMap.set(id, [{ ...cmRow, ...additionalProps }]);
            }
        }

        if ('downstream' in formQueryResult) {
            const DOWNSTREAM_COLS = environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns;
            additionalProps = { type: 'GDC' };
            for (const downstreamRow of formQueryResult.downstream) {
                const id = downstreamRow[DOWNSTREAM_COLS.GDC_LAT] + ' ' + downstreamRow[DOWNSTREAM_COLS.GDC_LONG];
                if (markerMap.has(id)) {
                    markerMap.get(id).push({ ...downstreamRow, ...additionalProps });
                } else {
                    markerMap.set(id, [{ ...downstreamRow, ...additionalProps }]);
                }
            }
        }

        return markerMap;
    }

    private createSkuMap(formQueryResult: FormQueryResult): Map<string, { upstream: any[], downstream: any[], cm: any[] }> {
        const skuMap = new Map<string, { upstream: any[], downstream: any[], cm: any[] }>();

        if ('upstream' in formQueryResult) {
            const UPSTREAM_PARENT_SKU = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns.PARENT_SKU;
            for (const upstreamRow of formQueryResult.upstream) {
                if (skuMap.has(upstreamRow[UPSTREAM_PARENT_SKU])) {
                    skuMap.get(upstreamRow[UPSTREAM_PARENT_SKU]).upstream.push(upstreamRow);
                } else {
                    skuMap.set(upstreamRow[UPSTREAM_PARENT_SKU], { upstream: [upstreamRow], downstream: [], cm: [] });
                }
            }
        }

        const CM_SKU = environment.bigQuery.layerDatasets.route.tables.CM.columns.SKU;
        for (const cmRow of formQueryResult.cm) {
            if (skuMap.has(cmRow[CM_SKU])) {
                skuMap.get(cmRow[CM_SKU]).cm.push(cmRow);
            } else {
                skuMap.set(cmRow[CM_SKU], { upstream: [], downstream: [], cm: [cmRow] });
            }
        }

        if ('downstream' in formQueryResult) {
            const DOWNSTREAM_SKU = environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns.SKU;
            for (const downstreamRow of formQueryResult.downstream) {
                if (skuMap.has(downstreamRow[DOWNSTREAM_SKU])) {
                    skuMap.get(downstreamRow[DOWNSTREAM_SKU]).downstream.push(downstreamRow);
                } else {
                    skuMap.set(downstreamRow[DOWNSTREAM_SKU], { upstream: [], downstream: [downstreamRow], cm: [] });
                }
            }
        }

        return skuMap;
    }
}
