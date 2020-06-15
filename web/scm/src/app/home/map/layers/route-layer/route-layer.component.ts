import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MapState } from '../../store/state';
import { RouteLayer } from '../../map.models';
import { selectMapRouteLayer } from '../../store/selectors';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html'
})
export class RouteLayerComponent {

  layer$: Observable<RouteLayer>;

  constructor(private store: Store<MapState>) {
    this.layer$ = this.store.select(selectMapRouteLayer);
  }

}
