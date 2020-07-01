import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ShapeLayer } from '../../map.models';
import { Store } from '@ngrx/store';
import { addFilter, removeFilter } from '../../store/actions';

@Component({
  selector: 'scm-shape-layer',
  templateUrl: './shape-layer.component.html',
  styleUrls: ['./shape-layer.component.scss']
})
export class ShapeLayerComponent implements OnInit, OnDestroy {

  polygons: google.maps.Polygon[] = [];

  _layer: ShapeLayer;
  @Input('layer')
  set layer(value: ShapeLayer) {
    this._layer = value;
    this.drawPolygons();
    this.store.dispatch(addFilter({
      filterIdentifier: 'ShapeLayer',
      filter: (markers) => {
        return markers.filter(marker => {
          for (const p of this.polygons) {
            if (google.maps.geometry.poly.containsLocation(
              new google.maps.LatLng(marker.latitude, marker.longitude),
              p
            )) {
              return true;
            }
          }
          return false;
        });
      }
    }));
  }

  _map: google.maps.Map;
  @Input('map')
  set map(value: google.maps.Map) {
    this._map = value;
    this.drawPolygons();
  }

  infoWindowData: {
    latitude: number,
    longitude: number,
    data: object
  }[] = [];

  constructor(private store: Store, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    for (const p of this.polygons) {
      p.setMap(null);
    }
    this.store.dispatch(removeFilter({ filterIdentifier: 'ShapeLayer' }));
  }

  layerClick($event) {
    this.infoWindowData.push({
      latitude: $event.latLng.lat(),
      longitude: $event.latLng.lng(),
      data: $event.feature.getProperty('data')
    });
  }

  private drawPolygons() {
    if (this._layer !== undefined && this._map !== undefined) {
      this.polygons = [];
      for (const shape of this._layer.shapes) {
        const p = new google.maps.Polygon({
          ...shape.shapeOpts,
          zIndex: 0,
          map: this._map
        });
        p.addListener('click', (event) => {
          this.infoWindowData.push({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
            data: shape.data
          });
          this.changeDetector.detectChanges();
        });
        this.polygons.push(p);
      }
    }
  }

}
