import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MapState } from '../../store/state';
import { RouteLayer } from '../../map.models';
import { selectMapLayer } from '../../store/selectors';
import { MapHelperService } from '../../services/map-helper/map-helper.service';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html'
})
export class RouteLayerComponent {

  layer: RouteLayer;

  constructor(private store: Store<MapState>) {
    this.store.select(selectMapLayer('Route Layer'))
      .subscribe(
        layer => {
          if ('markers' in layer && 'lines' in layer) {
            this.layer = layer;
          }
        }
      );
  }

}
