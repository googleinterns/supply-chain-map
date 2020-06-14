import { Component } from '@angular/core';
import { RouteLayerMarker, RouteLayerLine, Layer } from '../../map.models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MapState } from '../../store/state';
import { selectMapLayer  } from '../../store/selectors';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html'
})
export class RouteLayerComponent {

  layer$: Observable<Layer>;

  constructor(private store: Store<MapState>) {
    this.layer$ = this.store.select(selectMapLayer('Route Layer'));
  }

}
