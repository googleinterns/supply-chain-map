import { Component, Input, ViewChild } from '@angular/core';
import { RouteLayer, RouteLayerMarker } from '../../map.models';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html',
  styleUrls: ['./route-layer.component.scss']
})
export class RouteLayerComponent {

  @Input() layer: RouteLayer;
  private _map;
  @Input('map')
  set map(value: google.maps.Map) {
    this._map = value;
    this.addToggleDiv();
  }
  private _toggleDiv;
  @ViewChild('toggleDiv')
  set divContent(content) {
    this._toggleDiv = content;
    this.addToggleDiv();
  }
  showLines = true;

  constructor() {
  }

  filter(marker: RouteLayerMarker) {
    console.log('Filter now');
  }

  private addToggleDiv() {
    if (this._map && this._toggleDiv) {
      if (this._map.controls[google.maps.ControlPosition.TOP_CENTER].length === 0) {
        this._map.controls[google.maps.ControlPosition.TOP_CENTER].push(this._toggleDiv.nativeElement);
      }
    }
  }
}
