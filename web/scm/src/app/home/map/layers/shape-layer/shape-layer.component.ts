import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ShapeLayer } from '../../map.models';
import { Colors } from '../../../../../assets/colors';

@Component({
  selector: 'scm-shape-layer',
  templateUrl: './shape-layer.component.html',
  styleUrls: ['./shape-layer.component.scss']
})
export class ShapeLayerComponent implements OnInit {

  @Input() layer: ShapeLayer;
  infoWindowData: {
    latitude: number,
    longitude: number,
    data: object
  }[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  styleFunc = (feature) => {
    const o = {
      clickable: true,
      fillColor: feature.getProperty('color'),
      fillOpacity: 1,
      strokeWeight: 0.5,
      strokeColor: feature.getProperty('color'),
      zIndex: 0
    };

    return o;
  }

  layerClick($event) {
    this.infoWindowData.push({
      latitude: $event.latLng.lat(),
      longitude: $event.latLng.lng(),
      data: $event.feature.getProperty('data')
    });
    console.log(this.infoWindowData);
  }

}
