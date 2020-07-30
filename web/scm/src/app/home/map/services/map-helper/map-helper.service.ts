import { Injectable } from '@angular/core';
import { FormQueryResult } from 'src/app/home/home.models';
import { RouteLayerLine, RouteLayerMarker, Layer, HeatmapLayer, ShapeLayer, MFG_IDENTIFIER, CM_IDENTIFIER, GDC_IDENTIFIER } from '../../map.models';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { environment } from 'src/environments/environment';
import { constants } from 'src/constants';
import { Colors } from 'src/assets/colors';
import { createPolygonPath } from './geojson-converter';

@Injectable({
    providedIn: 'root'
})
export class MapHelperService {

    static readonly UPSTREAM_COLS = constants.bigQuery.datasets.route.tables.UPSTREAM.columns;
    static readonly CM_COLS = constants.bigQuery.datasets.route.tables.CM.columns;
    static readonly DOWNSTREAM_COLS = constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns;

    constructor(private bigQueryService: BigQueryService) { }

    /**
     * Map for the type of marker to the path
     * to its svg icon
     */
    public static readonly ICON_MAP = {
        GDC: 'assets/gdc.svg',
        MFG: 'assets/mfg.svg',
        CM: 'assets/cm.svg'
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
     * This method queries the dedicated heatmap dataset to get
     * all the data required to populate the heatmap
     * @param layerName Name of the heatmap layer
     * @throws exception if layer not found
     */
    private async getHeatmapLayer(layerName: string): Promise<HeatmapLayer> {
        const layerCols = constants.bigQuery.datasets.heatmap.columns;
        const SQL_FETCH_HEATMAP_LAYER = `
            SELECT ${layerCols.join(', ')}
            FROM ${constants.bigQuery.datasets.heatmap.dataset}.${layerName}
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
            const response = await this.bigQueryService.runQuery(SQL_FETCH_HEATMAP_LAYER);
            const markers = this.bigQueryService.convertResult(response.result);
            if (markers.length === 0) {
                throw new Error('Cannot find layer: '+layerName);
            }
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


    /**
     * This method queries the dedicated shape layer dataset to get
     * all the data required to populate the layer
     * @param layerName Name of the shape layer
     * @throws exception if layer not found
     */
    private async getShapeLayer(layerName: string): Promise<ShapeLayer> {
        const layerCols = constants.bigQuery.datasets.shape.columns;
        const SQL_FETCH_SHAPE_LAYER = `
            SELECT ${layerCols.join(', ')}
            FROM ${constants.bigQuery.datasets.shape.dataset}.${layerName}
        `;


        try {
            const response = await this.bigQueryService.runQuery(SQL_FETCH_SHAPE_LAYER);
            const shapes = this.bigQueryService.convertResult(response.result);
            if (shapes.length === 0) {
                throw new Error('Cannot find layer: '+layerName);
            }
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
                        -100 * (parseFloat(shape.magnitude)) / (maxMagnitude),
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

    /**
     * Use the RouteLayerMarker array to create an SKU mapping of
     * movement parts in the supply chain.
     * @param markers The markers obtained from running @method createMarkerPoints
     */
    public createLines(markers: RouteLayerMarker[]) {
        const skuMap = this.createSkuMapFromMarkers(markers);
        const lines: RouteLayerLine[] = [];

        for (const sku of skuMap.keys()) {
            /** Upstream lines */
            for (const upstreamMarker of skuMap.get(sku).upstream) {
                for (const cmMarker of skuMap.get(sku).cm) {
                    lines.push({
                        from: {
                            latitude: upstreamMarker.latitude,
                            longitude: upstreamMarker.longitude,
                            city: upstreamMarker.data.city,
                            state: upstreamMarker.data.state,
                            country: upstreamMarker.data.country
                        },
                        to: {
                            latitude: cmMarker.latitude,
                            longitude: cmMarker.longitude,
                            city: cmMarker.data.city,
                            state: cmMarker.data.state,
                            country: cmMarker.data.country
                        },
                        type: 'Upstream',
                        color: 'blue'
                    });
                }
            }

            /** Downstream lines */
            for (const cmMarker of skuMap.get(sku).cm) {
                for (const downstreamMarker of skuMap.get(sku).downstream) {
                    lines.push({
                        from: {
                            latitude: cmMarker.latitude,
                            longitude: cmMarker.longitude,
                            city: cmMarker.data.city,
                            state: cmMarker.data.state,
                            country: cmMarker.data.country
                        },
                        to: {
                            latitude: downstreamMarker.latitude,
                            longitude: downstreamMarker.longitude,
                            city: downstreamMarker.data.city,
                            state: downstreamMarker.data.state,
                            country: downstreamMarker.data.country
                        },
                        type: 'Downstream',
                        color: 'red'
                    });
                }
            }
        }

        return lines;
    }

    /**
     * Helper method used by @method createLines to build
     * a map that tracks the movement of a part by keeping track of
     * its SKU.
     */
    private createSkuMapFromMarkers(markers: RouteLayerMarker[]): Map<string, { upstream: RouteLayerMarker[], cm: RouteLayerMarker[], downstream: RouteLayerMarker[] }> {
        const skuMap = new Map<string, { upstream: RouteLayerMarker[], cm: RouteLayerMarker[], downstream: RouteLayerMarker[] }>();

        for (const marker of markers) {
            for (const sku of marker.data.sku) {
                if (!skuMap.has(sku)) {
                    skuMap.set(sku, { upstream: [], cm: [], downstream: [] });
                }
                if (marker.type === MFG_IDENTIFIER) {
                    skuMap.get(sku).upstream.push(marker);
                } else if (marker.type === CM_IDENTIFIER) {
                    skuMap.get(sku).cm.push(marker);
                } else if (marker.type === GDC_IDENTIFIER) {
                    skuMap.get(sku).downstream.push(marker);
                }
            }
        }

        return skuMap;
    }

    /**
     * Restructures the form query result to create representative
     * marker objects.
     * @param formQueryResult The resut obtained after running the form query
     */
    public createMarkerPoints(formQueryResult: FormQueryResult): RouteLayerMarker[] {

        if (!formQueryResult) {
            return [];
        }

        const markers: RouteLayerMarker[] = [];
        const markerMap = this.createLocationToMarkerMap(formQueryResult);

        for (const latLongId of markerMap.keys()) {
            const marker: RouteLayerMarker = {
                latitude: 0,
                longitude: 0,
                iconUrl: '',
                type: MFG_IDENTIFIER,
                data: {
                    partCount: 0,
                    product: [],
                    sku: [],
                    mpn: [],
                    description: [],
                    category: [],
                    name: [],
                    avgLeadTime: 0,
                    minLeadTime: Infinity,
                    maxLeadTime: -Infinity,
                    totalQty: 0,
                    unitCost: 0,
                    city: '',
                    state: '',
                    country: '',
                }
            };

            for (const dataPoint of markerMap.get(latLongId)) {
                if (dataPoint.type === MFG_IDENTIFIER) {
                    marker.type = MFG_IDENTIFIER;
                    marker.latitude = dataPoint[MapHelperService.UPSTREAM_COLS.MFG_LAT];
                    marker.longitude = dataPoint[MapHelperService.UPSTREAM_COLS.MFG_LONG];
                    marker.data.city = dataPoint[MapHelperService.UPSTREAM_COLS.MFG_CITY] ?? '';
                    marker.data.state = dataPoint[MapHelperService.UPSTREAM_COLS.MFG_STATE] ?? '';
                    marker.data.country = dataPoint[MapHelperService.UPSTREAM_COLS.MFG_COUNTRY] ?? '';
                    marker.data.totalQty += parseFloat(dataPoint[MapHelperService.UPSTREAM_COLS.TOTAL_QTY]);
                    marker.data.unitCost += parseFloat(dataPoint[MapHelperService.UPSTREAM_COLS.UNIT_COST]); // TODO(nirup): wrong, change this
                    marker.data.avgLeadTime += parseFloat(dataPoint[MapHelperService.UPSTREAM_COLS.LEAD_TIME]);
                    marker.data.minLeadTime = Math.min(marker.data.minLeadTime, parseFloat(dataPoint[MapHelperService.UPSTREAM_COLS.LEAD_TIME]));
                    marker.data.maxLeadTime = Math.max(marker.data.maxLeadTime, parseFloat(dataPoint[MapHelperService.UPSTREAM_COLS.LEAD_TIME]));
                    marker.data.product.push(dataPoint[MapHelperService.UPSTREAM_COLS.PRODUCT]);
                    marker.data.sku.push(dataPoint[MapHelperService.UPSTREAM_COLS.PARENT_SKU]);
                    marker.data.mpn.push(dataPoint[MapHelperService.UPSTREAM_COLS.MPN]);
                    marker.data.description.push(dataPoint[MapHelperService.UPSTREAM_COLS.DESCRIPTION]);
                    marker.data.category.push(dataPoint[MapHelperService.UPSTREAM_COLS.CATEGORY]);
                    marker.data.name.push(dataPoint[MapHelperService.UPSTREAM_COLS.SUPPLIER_NAME]);
                } else if (dataPoint.type === CM_IDENTIFIER) {
                    marker.type = CM_IDENTIFIER;
                    marker.latitude = dataPoint[MapHelperService.CM_COLS.CM_LAT];
                    marker.longitude = dataPoint[MapHelperService.CM_COLS.CM_LONG];
                    marker.data.city = dataPoint[MapHelperService.CM_COLS.CM_CITY] ?? '';
                    marker.data.state = dataPoint[MapHelperService.CM_COLS.CM_STATE] ?? '';
                    marker.data.country = dataPoint[MapHelperService.CM_COLS.CM_COUNTRY] ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint[MapHelperService.CM_COLS.LEAD_TIME], 10);
                    marker.data.minLeadTime = Math.min(marker.data.minLeadTime, parseFloat(dataPoint[MapHelperService.CM_COLS.LEAD_TIME]));
                    marker.data.maxLeadTime = Math.max(marker.data.maxLeadTime, parseFloat(dataPoint[MapHelperService.CM_COLS.LEAD_TIME]));
                    marker.data.product.push(dataPoint[MapHelperService.CM_COLS.PRODUCT]);
                    marker.data.sku.push(dataPoint[MapHelperService.CM_COLS.SKU]);
                    marker.data.description.push(dataPoint[MapHelperService.CM_COLS.DESCRIPTION]);
                    marker.data.name.push(dataPoint[MapHelperService.CM_COLS.CM_NAME]);
                } else if (dataPoint.type === GDC_IDENTIFIER) {
                    marker.type = GDC_IDENTIFIER;
                    marker.latitude = dataPoint[MapHelperService.DOWNSTREAM_COLS.GDC_LAT];
                    marker.longitude = dataPoint[MapHelperService.DOWNSTREAM_COLS.GDC_LONG];
                    marker.data.city = dataPoint[MapHelperService.DOWNSTREAM_COLS.GDC_CITY] ?? '';
                    marker.data.state = dataPoint[MapHelperService.DOWNSTREAM_COLS.GDC_STATE] ?? '';
                    marker.data.country = dataPoint[MapHelperService.DOWNSTREAM_COLS.GDC_COUNTRY] ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint[MapHelperService.DOWNSTREAM_COLS.LEAD_TIME], 10);
                    marker.data.minLeadTime = Math.min(marker.data.minLeadTime, parseFloat(dataPoint[MapHelperService.DOWNSTREAM_COLS.LEAD_TIME]));
                    marker.data.maxLeadTime = Math.max(marker.data.maxLeadTime, parseFloat(dataPoint[MapHelperService.DOWNSTREAM_COLS.LEAD_TIME]));
                    marker.data.product.push(dataPoint[MapHelperService.DOWNSTREAM_COLS.PRODUCT]);
                    marker.data.sku.push(dataPoint[MapHelperService.DOWNSTREAM_COLS.SKU]);
                    marker.data.name.push(dataPoint[MapHelperService.DOWNSTREAM_COLS.GDC_CODE]);
                }
            }

            marker.data.partCount = markerMap.get(latLongId).length;
            marker.data.avgLeadTime /= markerMap.get(latLongId).length;

            marker.data.product = [...new Set(marker.data.product)];
            marker.data.name = [...new Set(marker.data.name)];
            marker.data.description = [...new Set(marker.data.description)];
            marker.data.category = [...new Set(marker.data.category)];
            marker.data.sku = [...new Set(marker.data.sku)];
            if (marker.data.mpn.length > 0) {
                marker.data.mpn = [...new Set(marker.data.mpn)];
            } else {
                delete marker.data.mpn;
            }

            switch (marker.type) {
                case MFG_IDENTIFIER: {
                    marker.iconUrl = MapHelperService.ICON_MAP.MFG;
                    break;
                }
                case CM_IDENTIFIER: {
                    marker.iconUrl = MapHelperService.ICON_MAP.CM;
                    break;
                }
                case GDC_IDENTIFIER: {
                    marker.iconUrl = MapHelperService.ICON_MAP.GDC;
                    break;
                }
            }

            markers.push(marker);
        }
        return markers;
    }

    /**
     * Maps each row in the form query result to its corresponding location.
     * The returned map looks like this:
     * "lat long" => [upstreamRow1, upstreamRow2, cmRow1, downStreamRow1]
     * This means that all of those rows are present at that exact location.
     * But this is a problem, because we cannot combine all of them in one marker.
     * @method flattenMapWithDisplacement takes such arrays or rows and adds a small displacement.
     * This way, we have unique rows for each node in the supply chain.
     */
    private createLocationToMarkerMap(formQueryResult: FormQueryResult): Map<string, Array<any>> {
        const markerMap = new Map<string, Map<string, Array<any>>>();
        let additionalProps;

        if ('upstream' in formQueryResult) {
            additionalProps = { type: MFG_IDENTIFIER };
            for (const upstreamRow of formQueryResult.upstream) {
                const id = upstreamRow[MapHelperService.UPSTREAM_COLS.MFG_LAT] + ' ' + upstreamRow[MapHelperService.UPSTREAM_COLS.MFG_LONG];
                if (!markerMap.has(id)) {
                    markerMap.set(id, new Map<string, Array<any>>());
                }
                if (!markerMap.get(id).has(upstreamRow[MapHelperService.UPSTREAM_COLS.SUPPLIER_NAME])) {
                    markerMap.get(id).set(upstreamRow[MapHelperService.UPSTREAM_COLS.SUPPLIER_NAME], []);
                }
                markerMap.get(id).get(upstreamRow[MapHelperService.UPSTREAM_COLS.SUPPLIER_NAME]).push({ ...upstreamRow, ...additionalProps });
            }
        }

        additionalProps = { type: CM_IDENTIFIER };
        for (const cmRow of formQueryResult.cm) {
            const id = cmRow[MapHelperService.CM_COLS.CM_LAT] + ' ' + cmRow[MapHelperService.CM_COLS.CM_LONG];
            if (!markerMap.has(id)) {
                markerMap.set(id, new Map<string, Array<any>>());
            }
            if (!markerMap.get(id).has(cmRow[MapHelperService.CM_COLS.CM_NAME])) {
                markerMap.get(id).set(cmRow[MapHelperService.CM_COLS.CM_NAME], []);
            }
            markerMap.get(id).get(cmRow[MapHelperService.CM_COLS.CM_NAME]).push({ ...cmRow, ...additionalProps });
        }

        if ('downstream' in formQueryResult) {
            additionalProps = { type: GDC_IDENTIFIER };
            for (const downstreamRow of formQueryResult.downstream) {
                const id = downstreamRow[MapHelperService.DOWNSTREAM_COLS.GDC_LAT] + ' ' + downstreamRow[MapHelperService.DOWNSTREAM_COLS.GDC_LONG];
                if (!markerMap.has(id)) {
                    markerMap.set(id, new Map<string, Array<any>>());
                }
                if (!markerMap.get(id).has(downstreamRow[MapHelperService.DOWNSTREAM_COLS.GDC_CODE])) {
                    markerMap.get(id).set(downstreamRow[MapHelperService.DOWNSTREAM_COLS.GDC_CODE], []);
                }
                markerMap.get(id).get(downstreamRow[MapHelperService.DOWNSTREAM_COLS.GDC_CODE]).push({ ...downstreamRow, ...additionalProps });
            }
        }

        return this.flattenMapWithDisplacement(markerMap);
    }

    /**
     * this method takes the map that is passed to it, and flattens it to look
     * like this
     * {
     * "lat long1" => [upstreamRow1, upstreamRow2]
     * "lat long2" => [upstreamRow2, upstreamRow3]
     * "lat long3" => [cmRow1, cmRow2]
     * }
     * It adds a small displacement to the latlong to make sure that
     * each type of node gets a different marker.
     * @param markerMap This is the map that looks like this
     * "lat long" => {
     *  upstream1: [upstreamRow1, upstreamRow2]
     *  upstream1: [upstreamRow2, upstreamRow3]
     *  cm1: [cmRow1, cmRow2]
     * }
     */
    private flattenMapWithDisplacement(markerMap: Map<string, Map<string, Array<any>>>) {
        const flatMap = new Map<string, Array<any>>();
        const displace = (latLng: Array<number>, totalMarkers: number, curPos: number) => {
            const a = 360.0 / totalMarkers;
            return [
                latLng[0] + -.00004 * Math.cos((+a * curPos) / 180 * Math.PI),
                latLng[1] + -.00004 * Math.sin((+a * curPos) / 180 * Math.PI)
            ];
        };
        for (const latLongId of markerMap.keys()) {
            let i = 0;
            for (const supplier of markerMap.get(latLongId).keys()) {
                const newLatLong = displace(latLongId.split(' ').map(x => parseFloat(x)), markerMap.get(latLongId).size, i);
                flatMap.set(newLatLong.join(' '), markerMap.get(latLongId).get(supplier).map(marker => {
                    if (marker.type === MFG_IDENTIFIER) {
                        marker[MapHelperService.UPSTREAM_COLS.MFG_LAT] = newLatLong[0];
                        marker[MapHelperService.UPSTREAM_COLS.MFG_LONG] = newLatLong[1];
                    } else if (marker.type === CM_IDENTIFIER) {
                        marker[MapHelperService.CM_COLS.CM_LAT] = newLatLong[0];
                        marker[MapHelperService.CM_COLS.CM_LONG] = newLatLong[1];
                    } else if (marker.type === GDC_IDENTIFIER) {
                        marker[MapHelperService.DOWNSTREAM_COLS.GDC_LAT] = newLatLong[0];
                        marker[MapHelperService.DOWNSTREAM_COLS.GDC_LONG] = newLatLong[1];
                    }

                    return marker;
                }));
                i++;
            }
        }

        return flatMap;
    }
}
