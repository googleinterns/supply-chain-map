import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Layer } from './map.models';
import { selectMapLayers } from './store/selectors';

@Component({
  selector: 'scm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  $layers: Observable<Layer[]>;
  map: google.maps.Map;

  constructor(store: Store) {
    this.$layers = store.select(selectMapLayers);
  }

  isOfTypeRouteLayer(layer: Layer) {
    return 'markers' in layer && 'lines' in layer;
  }

  isOfTypeHeatmapLayer(layer: Layer) {
    return 'hotspots' in layer;
  }

  isOfTypeShapeLayer(layer: Layer) {
    return 'shapes' in layer;
  }

  onMapLoad(mapInstance) {
    this.map = mapInstance;
  }

}
