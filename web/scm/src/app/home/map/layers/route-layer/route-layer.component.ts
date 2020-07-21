import { Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { RouteLayerMarker, RouteLayerLine } from '../../map.models';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { MapHelperService } from '../../services/map-helper/map-helper.service';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html',
  styleUrls: ['./route-layer.component.scss']
})
export class RouteLayerComponent implements OnDestroy {

  markers: RouteLayerMarker[] = [];
  lines: RouteLayerLine[] = [];
  showLines = true;

  @Input() map: google.maps.Map;

  private _toggleDiv;
  @ViewChild('toggleDiv')
  set divContent(content) {
    this._toggleDiv = content;
    this.addToggleDiv();
  }

  constructor(private store: Store, private mapHelperService: MapHelperService) {
    this.store.select(selectHomeFormQueryResult).subscribe(
      formQueryResult => {
        this.markers = this.mapHelperService.createMarkerPoints(formQueryResult);
        this.lines = this.mapHelperService.createLines(this.markers);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.map.controls[google.maps.ControlPosition.TOP_CENTER].getLength() !== 0) {
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].clear();
    }
  }

  private addToggleDiv() {
    if (this.map && this._toggleDiv) {
      if (this.map.controls[google.maps.ControlPosition.TOP_CENTER].getLength() === 0) {
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this._toggleDiv.nativeElement);
      }
    }
  }
}
