import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ShapeLayer } from '../../map.models';
import { Store } from '@ngrx/store';
import { addFilter, removeFilter } from 'src/app/home/store/actions';
import { environment } from 'src/environments/environment';
import { FormQueryResult } from 'src/app/home/home.models';
import { constants } from 'src/constants';

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
      filterIdentifier: this._layer.name,
      filter: (formQueryResult) => {
        const filteredFormQueryResult: any = {};
        if ('upstream' in formQueryResult) {
          const UPSTREAM_COLS = constants.bigQuery.layerDatasets.route.tables.UPSTREAM.columns;
          filteredFormQueryResult.upstream = formQueryResult.upstream.filter(upstream => {
            for (const p of this.polygons) {
              if (google.maps.geometry.poly.containsLocation(
                new google.maps.LatLng(upstream[UPSTREAM_COLS.MFG_LAT], upstream[UPSTREAM_COLS.MFG_LONG]),
                p
              )) {
                return true;
              }
            }
            return false;
          });
        }

        const CM_COLS = constants.bigQuery.layerDatasets.route.tables.CM.columns;
        filteredFormQueryResult.cm = formQueryResult.cm.filter(cm => {
          for (const p of this.polygons) {
            if (google.maps.geometry.poly.containsLocation(
              new google.maps.LatLng(cm[CM_COLS.CM_LAT], cm[CM_COLS.CM_LONG]),
              p
            )) {
              return true;
            }
          }
          return false;
        });

        if ('downstream' in formQueryResult) {
          const DOWNSTREAM_COLS = constants.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns;
          filteredFormQueryResult.downstream = formQueryResult.downstream.filter(downstream => {
            for (const p of this.polygons) {
              if (google.maps.geometry.poly.containsLocation(
                new google.maps.LatLng(downstream[DOWNSTREAM_COLS.GDC_LAT], downstream[DOWNSTREAM_COLS.GDC_LONG]),
                p
              )) {
                return true;
              }
            }
            return false;
          });
        }
        return filteredFormQueryResult;
      },
      isActive: false
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
    this.store.dispatch(removeFilter({ filterIdentifier: this._layer.name }));
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
          zIndex: -1,
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
