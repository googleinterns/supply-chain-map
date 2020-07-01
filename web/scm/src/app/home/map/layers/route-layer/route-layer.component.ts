import { Component, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RouteLayer, RouteLayerMarker, FilterFunction, RouteLayerLine } from '../../map.models';
import { Store } from '@ngrx/store';
import { selectMapFilters } from '../../store/selectors';

@Component({
  selector: 'scm-route-layer',
  templateUrl: './route-layer.component.html',
  styleUrls: ['./route-layer.component.scss']
})
export class RouteLayerComponent {
  private filters: FilterFunction[] = [];
  markers: RouteLayerMarker[] = [];
  lines: RouteLayerLine[] = [];
  showLines = true;

  private _layer: RouteLayer;
  @Input('layer')
  set layer(value: RouteLayer) {
    this._layer = value;
    this.filterLayer();
  }

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

  constructor(private store: Store, private changeDetector: ChangeDetectorRef) {
    this.store.select(selectMapFilters)
      .subscribe(
        filters => {
          this.filters = filters;
          this.filterLayer();
        }
      );
  }

  filter(marker: RouteLayerMarker) {
    console.log('Filter now');
  }

  private filterLayer() {
    if (this._layer === undefined) {
      return;
    }

    let _m = this._layer.markers;
    for (const filter of this.filters) {
      _m = filter(_m);
    }
    this.markers = _m;

    const markerSet = new Set(this.markers.map(marker => marker.latitude + ' ' + marker.longitude));
    this.lines = this._layer.lines.filter(l => markerSet.has(l.from.latitude + ' ' + l.from.longitude) &&
                                        markerSet.has(l.to.latitude + ' ' + l.to.longitude));

    this.changeDetector.detectChanges();
  }

  private addToggleDiv() {
    if (this._map && this._toggleDiv) {
      if (this._map.controls[google.maps.ControlPosition.TOP_CENTER].length === 0) {
        this._map.controls[google.maps.ControlPosition.TOP_CENTER].push(this._toggleDiv.nativeElement);
      }
    }
  }
}
