import { Component, Input } from '@angular/core';
import { RouteLayer } from '../../map.models';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html'
})
export class RouteLayerComponent {

  @Input() layer: RouteLayer;

  constructor() {
  }

}
