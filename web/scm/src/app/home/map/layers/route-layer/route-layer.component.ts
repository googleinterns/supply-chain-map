import { Component, Input } from '@angular/core';
import { RouteLayer, RouteLayerMarker } from '../../map.models';
import { Store } from '@ngrx/store';
import { skuFilterFormQueryResult } from 'src/app/home/store/actions';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html'
})
export class RouteLayerComponent {

  @Input() layer: RouteLayer;

  constructor(private store: Store) {
  }

  filter(marker: RouteLayerMarker) {
    this.store.dispatch(skuFilterFormQueryResult({ sku: new Set(marker.data.sku) }));
  }
}
