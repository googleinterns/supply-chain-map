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

  constructor(store: Store) {
    this.$layers = store.select(selectMapLayers);
    this.$layers.subscribe(
      console.log
    )
  }

  isOfTypeRouteLayer(layer: Layer) {
    console.log(layer);
    return 'markers' in layer && 'lines' in layer;
  }

}
