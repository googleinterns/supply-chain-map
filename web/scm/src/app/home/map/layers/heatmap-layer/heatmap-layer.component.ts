import { Input, Component, OnDestroy } from '@angular/core';
import { HeatmapLayer } from '../../map.models';

@Component({
    selector: 'scm-heatmap-layer',
    templateUrl: './heatmap-layer.component.html'
})
export class HeatmapLayerComponent implements OnDestroy {

    _map: google.maps.Map;
    @Input('map')
    set map(value: google.maps.Map) {
        this._map = value;
        this.drawHeatmap();
    }

    _layer: HeatmapLayer
    @Input('layer')
    set layer(value: HeatmapLayer) {
        this._layer = value;
        this.drawHeatmap();
    }
    private heatmap: google.maps.visualization.HeatmapLayer;

    constructor() {
    }

    ngOnDestroy(): void {
        if (this.heatmap) {
            this.heatmap.setMap(null);
        }
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
