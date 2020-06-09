import { Component, OnInit, Input } from '@angular/core';
import { RouteLayerMarker, RouteLayerLine } from '../../map.models';
import { FormQueryResult } from 'src/app/home/home.models';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { MapState } from '../../store/state';
import { selectMapRouteLayerMarkers, selectMapRouteLayerLines } from '../../store/selectors';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html',
  styleUrls: ['./route-layer.component.scss']
})
export class RouteLayerComponent {

  routeLayerMarkers$ = this.store.select(selectMapRouteLayerMarkers);
  routeLayerLines$ = this.store.select(selectMapRouteLayerLines);

  constructor(private store: Store<MapState>) {
  }

  markers: RouteLayerMarker[] = [];
  lines: RouteLayerLine[] = [];

}
