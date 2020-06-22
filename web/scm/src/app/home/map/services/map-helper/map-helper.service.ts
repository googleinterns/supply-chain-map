import { Injectable } from '@angular/core';
import { FormQueryResult } from 'src/app/home/home.models';
import { RouteLayerLine, RouteLayerMarker, Layer, HeatMapLayer } from '../../map.models';
import { BigQueryService } from 'src/app/home/services/big-query/big-query.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MapHelperService {

    constructor(private bigQueryService: BigQueryService) {}

    private static readonly ICON_MAP = {
        GDC: 'assets/gdc.svg',
        MFG: 'assets/mfg.svg',
        CM: 'assets/cm.svg',
        MFG_CM: 'assets/mfg_cm.svg'
    };

    public getLayer(layer: Layer){
        const layerName = layer.name;
        if ('hotspots' in layer) {
            return this.getHeatmapLayer(layerName);
        }
    }

    private async getHeatmapLayer(layerName: string): Promise<HeatMapLayer> {
        const layerCols = environment.bigQuery.layerDatasets.heatmap.columns;
        const SQL_FETCH_ADDITIONAL_LAYER = `
            SELECT ${layerCols.join(', ')}
            FROM ${environment.bigQuery.layerDatasets.heatmap.dataset}.${layerName}
        `;

        try {
            const response = await this.bigQueryService.runQuery(SQL_FETCH_ADDITIONAL_LAYER);
            const result = response.result;
            const markers = [];

            for (const row of result.rows) {
                const marker = {};
                for (let col = 0; col < layerCols.length; col++) {
                    marker[layerCols[col]] = row.f[col].v;
                }
                markers.push(marker);
            }

            return {
                name: layerName,
                hotspots: markers
            };
        } catch (ex) {
            if (!environment.production) {
                console.error(ex);
            }
            throw new Error('Cannot load layer ' + layerName);
        }
    }

    public createLines(formQueryResult: FormQueryResult): RouteLayerLine[] {
        const skuMap = this.createSkuMap(formQueryResult);
        const lines: RouteLayerLine[] = [];

        for (const sku of skuMap.keys()) {
            /** Upstream lines */
            for (const upstreamRow of skuMap.get(sku).upstream) {
                for (const cmRow of skuMap.get(sku).cm) {
                    lines.push({
                        from: {
                            lat: upstreamRow.mfg_lat,
                            long: upstreamRow.mfg_long,
                            city: upstreamRow.mfg_city,
                            state: upstreamRow.mfg_state,
                            country: upstreamRow.mfg_country
                        },
                        to: {
                            lat: cmRow.cm_lat,
                            long: cmRow.cm_long,
                            city: cmRow.cm_city,
                            state: cmRow.cm_state,
                            country: cmRow.cm_country
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
                            lat: cmRow.cm_lat,
                            long: cmRow.cm_long,
                            city: cmRow.cm_city,
                            state: cmRow.cm_state,
                            country: cmRow.cm_country
                        },
                        to: {
                            lat: downstreamRow.gdc_lat,
                            long: downstreamRow.gdc_long,
                            city: downstreamRow.gdc_city,
                            state: downstreamRow.gdc_state,
                            country: downstreamRow.gdc_country
                        },
                        type: 'DOWNSTREAM',
                        color: 'red'
                    });
                }
            }
        }

        return lines;
    }

    public createMarkerPoints(formQueryResult: FormQueryResult): RouteLayerMarker[] {

        const markers: RouteLayerMarker[] = [];
        const markerMap = this.createLocationToMarkerMap(formQueryResult);

        for (const latLongId of markerMap.keys()) {
            const marker: RouteLayerMarker = {
                lat: 0,
                long: 0,
                iconUrl: '',
                type: [],
                data: {
                    product: [],
                    sku: [],
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
                    marker.lat = dataPoint.mfg_lat;
                    marker.long = dataPoint.mfg_long;
                    marker.data.city = dataPoint.mfg_city ?? '';
                    marker.data.state = dataPoint.mfg_state ?? '';
                    marker.data.country = dataPoint.mfg_country ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint.lead_time, 10);
                    marker.data.product.push(dataPoint.product);
                    marker.data.sku.push(dataPoint.parent_sku);
                    marker.data.description.push(dataPoint.description);
                    marker.data.category.push(dataPoint.category);
                    marker.data.name.push(dataPoint.category); //Makes more sense than description
                } else if (dataPoint.type === 'CM') {
                    marker.type.push('CM');
                    marker.lat = dataPoint.cm_lat;
                    marker.long = dataPoint.cm_long;
                    marker.data.city = dataPoint.cm_city ?? '';
                    marker.data.state = dataPoint.cm_state ?? '';
                    marker.data.country = dataPoint.cm_country ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint.lead_time, 10);
                    marker.data.product.push(dataPoint.product);
                    marker.data.sku.push(dataPoint.sku);
                    marker.data.description.push(dataPoint.description);
                    marker.data.name.push(dataPoint.cm_name);
                } else if (dataPoint.type === 'GDC') {
                    marker.type.push('GDC');
                    marker.lat = dataPoint.gdc_lat;
                    marker.long = dataPoint.gdc_long;
                    marker.data.city = dataPoint.gdc_city ?? '';
                    marker.data.state = dataPoint.gdc_state ?? '';
                    marker.data.country = dataPoint.gdc_country ?? '';
                    marker.data.avgLeadTime += parseInt(dataPoint.lead_time, 10);
                    marker.data.product.push(dataPoint.product);
                    marker.data.sku.push(dataPoint.sku);
                    marker.data.name.push(dataPoint.gdc_code);
                }
            }

            marker.data.avgLeadTime /= markerMap.get(latLongId).length;

            marker.type = [...new Set(marker.type)];
            marker.data.product = [...new Set(marker.data.product)];
            marker.data.name = [...new Set(marker.data.name)];
            marker.data.description = [...new Set(marker.data.description)];
            marker.data.category = [...new Set(marker.data.category)];
            marker.data.sku = [...new Set(marker.data.sku)];

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

    private createLocationToMarkerMap(formQueryResult: FormQueryResult): Map<string, Array<any>> {
        const markerMap = new Map<string, Array<any>>();

        let additionalProps = { type: 'MFG' };
        for (const upstreamRow of formQueryResult.upstream) {
            const id = upstreamRow.mfg_lat + ' ' + upstreamRow.mfg_long;
            if (markerMap.has(id)) {
                markerMap.get(id).push({ ...upstreamRow, ...additionalProps });
            } else {
                markerMap.set(id, [{ ...upstreamRow, ...additionalProps }]);
            }
        }
        additionalProps = { type: 'CM' };
        for (const cmRow of formQueryResult.cm) {
            const id = cmRow.cm_lat + ' ' + cmRow.cm_long;
            if (markerMap.has(id)) {
                markerMap.get(id).push({ ...cmRow, ...additionalProps });
            } else {
                markerMap.set(id, [{ ...cmRow, ...additionalProps }]);
            }
        }

        additionalProps = { type: 'GDC' };
        for (const downstreamRow of formQueryResult.downstream) {
            const id = downstreamRow.gdc_lat + ' ' + downstreamRow.gdc_long;
            if (markerMap.has(id)) {
                markerMap.get(id).push({ ...downstreamRow, ...additionalProps });
            } else {
                markerMap.set(id, [{ ...downstreamRow, ...additionalProps }]);
            }
        }

        return markerMap;
    }

    private createSkuMap(formQueryResult: FormQueryResult): Map<string, { upstream: any[], downstream: any[], cm: any[] }> {
        const skuMap = new Map<string, { upstream: any[], downstream: any[], cm: any[] }>();

        for (const upstreamRow of formQueryResult.upstream) {
            if (skuMap.has(upstreamRow.parent_sku)) {
                skuMap.get(upstreamRow.parent_sku).upstream.push(upstreamRow);
            } else {
                skuMap.set(upstreamRow.parent_sku, { upstream: [upstreamRow], downstream: [], cm: [] });
            }
        }

        for (const cmRow of formQueryResult.cm) {
            if (skuMap.has(cmRow.sku)) {
                skuMap.get(cmRow.sku).cm.push(cmRow);
            } else {
                skuMap.set(cmRow.sku, { upstream: [], downstream: [], cm: [cmRow] });
            }
        }

        for (const downstreamRow of formQueryResult.downstream) {
            if (skuMap.has(downstreamRow.sku)) {
                skuMap.get(downstreamRow.sku).downstream.push(downstreamRow);
            } else {
                skuMap.set(downstreamRow.sku, { upstream: [], downstream: [downstreamRow], cm: [] });
            }
        }

        return skuMap;
    }
}
