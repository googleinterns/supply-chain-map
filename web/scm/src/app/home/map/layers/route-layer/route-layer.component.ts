import { Component } from '@angular/core';
import { RouteLayerMarker, RouteLayerLine } from '../../map.models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MapState } from '../../store/state';
import { selectMapRouteLayerMarkers, selectMapRouteLayerLines } from '../../store/selectors';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html',
  styleUrls: ['./route-layer.component.scss']
})
export class RouteLayerComponent {

  routeLayerMarkers$: Observable<RouteLayerMarker[]>;
  routeLayerLines$: Observable<RouteLayerLine[]>;

  constructor(private store: Store<MapState>) {
    this.routeLayerMarkers$ = this.store.select(selectMapRouteLayerMarkers);
    this.routeLayerLines$ = this.store.select(selectMapRouteLayerLines);
  }

}
