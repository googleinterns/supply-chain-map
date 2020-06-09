import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RouteLayerComponent } from './layers/route-layer/route-layer.component';

@Component({
  selector: 'scm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
