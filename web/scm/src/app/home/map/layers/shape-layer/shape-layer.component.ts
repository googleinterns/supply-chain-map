import { Component, OnInit, Input } from '@angular/core';
import { ShapeLayer } from '../../map.models';
import { Colors } from '../../../../../assets/colors';

@Component({
  selector: 'scm-shape-layer',
  templateUrl: './shape-layer.component.html',
  styleUrls: ['./shape-layer.component.scss']
})
export class ShapeLayerComponent implements OnInit {

  color: string;
  maxMagnitude: number;
  // tslint:disable-next-line: variable-name
  _layer: ShapeLayer;
  @Input('layer') 
  set layer(value: ShapeLayer) {
    this._layer = value;
    let maxMagnitude = -1;
    for (const shape of this._layer.shapes) {
      maxMagnitude = Math.max(maxMagnitude, shape.magnitude);
    }
    this.maxMagnitude = maxMagnitude;
  }

  constructor() {
    this.color = Colors.randomColor();
  }

  ngOnInit(): void {
  }

  styleFunc = (feature) => {
    const o = {
      clickable: true,
      fillColor: Colors.lightenDarkenColor(
        this.color,
        -50 * (parseFloat(feature.getProperty('magnitude'))) / (this.maxMagnitude)
      ),
      fillOpacity: 1,
      strokeWeight: 0.5,
      strokeColor: this.color
    };

    return o;
  }

}
