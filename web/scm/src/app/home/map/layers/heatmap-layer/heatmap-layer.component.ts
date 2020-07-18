import { Input, Component, OnDestroy } from '@angular/core';
import { HeatmapLayer } from '../../map.models';
import { Store } from '@ngrx/store';
import { addFilter, removeFilter } from 'src/app/home/store/actions';
import { constants } from 'src/constants';

@Component({
    selector: 'scm-heatmap-layer',
    template: ''
})
export class HeatmapLayerComponent implements OnDestroy {

    _map: google.maps.Map;
    @Input('map')
    set map(value: google.maps.Map) {
        this._map = value;
        this.drawHeatmap();
    }

    _layer: HeatmapLayer;
    @Input('layer')
    set layer(value: HeatmapLayer) {
        this._layer = value;
        this.drawHeatmap();
        this.store.dispatch(addFilter({
            filterIdentifier: this._layer.name,
            filter: (formQueryResult) => {
                const filteredFormQueryResult: any = {};
                if ('upstream' in formQueryResult) {
                    const UPSTREAM_COLS = constants.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
                    filteredFormQueryResult.upstream = formQueryResult.upstream.filter(upstream => {
                        for (const hotspot of this._layer.hotspots) {
                            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                                new google.maps.LatLng(upstream[UPSTREAM_COLS.MFG_LAT], upstream[UPSTREAM_COLS.MFG_LONG]),
                                new google.maps.LatLng(hotspot.latitude, hotspot.longitude)
                            );
                            if (distance <= 20000) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
                if ('cm' in formQueryResult) {
                    const CM_COLS = constants.bigQuery.layerDatasets.route.tables.CM.columns;
                    filteredFormQueryResult.cm = formQueryResult.cm.filter(cm => {
                        for (const hotspot of this._layer.hotspots) {
                            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                                new google.maps.LatLng(cm[CM_COLS.CM_LAT], cm[CM_COLS.CM_LONG]),
                                new google.maps.LatLng(hotspot.latitude, hotspot.longitude)
                            );
                            if (distance <= 20000) {
                                return true;
                            }
                        }
                        return false;
                    });
                }
                if ('downstream' in formQueryResult) {
                    const DOWNSTREAM_COLS = constants.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns;
                    filteredFormQueryResult.downstream = formQueryResult.downstream.filter(downstream => {
                        for (const hotspot of this._layer.hotspots) {
                            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                                new google.maps.LatLng(downstream[DOWNSTREAM_COLS.GDC_LAT], downstream[DOWNSTREAM_COLS.GDC_LONG]),
                                new google.maps.LatLng(hotspot.latitude, hotspot.longitude)
                            );
                            if (distance <= 20000) {
                                return true;
                            }
                        }
                        return false;
                    });
                }

                return filteredFormQueryResult;
            },
            isActive: false
        }));
    }
    private heatmap: google.maps.visualization.HeatmapLayer;

    constructor(private store: Store) {
    }

    ngOnDestroy(): void {
        if (this.heatmap) {
            this.heatmap.setMap(null);
        }
        this.store.dispatch(removeFilter({ filterIdentifier: this._layer.name }));
    }

    private drawHeatmap() {
        if (this._layer !== undefined && this._map !== undefined) {
            let max = this._layer.hotspots[0].magnitude;
            for (const hotspot of this._layer.hotspots) {
                max = Math.max(max, hotspot.magnitude);
            }

            this.heatmap = new google.maps.visualization.HeatmapLayer({
                data: this._layer.hotspots.map(e => ({
                    location: new google.maps.LatLng(e.latitude, e.longitude),
                    weight: e.magnitude / max
                }))
            });
            this.heatmap.setMap(this._map);
        }
    }
}
