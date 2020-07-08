import { Component, Input, ViewChild } from '@angular/core';
import { RouteLayer, RouteLayerMarker } from '../../map.models';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html',
  styleUrls: ['./route-layer.component.scss']
})
export class RouteLayerComponent {
  showLines = true;

  @Input() layer: RouteLayer;
  @Input() map: google.maps.Map;

  private _toggleDiv;
  @ViewChild('toggleDiv')
  set divContent(content) {
    this._toggleDiv = content;
    this.addToggleDiv();
  }

  constructor() {
  }

  filter(marker) {
    console.log('Filter now');
  }

  private addToggleDiv() {
    if (this.map && this._toggleDiv) {
      if (this.map.controls[google.maps.ControlPosition.TOP_CENTER].getLength() === 0) {
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this._toggleDiv.nativeElement);
      }
    }
  }
}
