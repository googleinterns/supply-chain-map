import { Component } from '@angular/core';
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

  layers: Layer[] = [];
  map: google.maps.Map;
  isLoading$: Observable<boolean>;
  error$: Observable<Error>;

  initialZoomLatLong = {
    lat: 34.690398,
    long: -178.421932
  };

  constructor(private store: Store) {
    this.store.select(selectMapLayers).subscribe(
      inLayers => this.layers = inLayers
    );
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
