import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Layer } from './map.models';
import { selectMapLayers, selectMapIsLoading, selectMapError } from './store/selectors';

@Component({
  selector: 'scm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  $layers: Observable<Layer[]>;
  map: google.maps.Map;
  isLoading$: Observable<boolean>;
  error$: Observable<Error>;

  constructor(private store: Store) {
    this.$layers = this.store.select(selectMapLayers);
    this.isLoading$ = this.store.select(selectMapIsLoading);
    this.error$ = this.store.select(selectMapError);
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
