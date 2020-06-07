import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormQueryResult } from '../services/home-helper/home-helper.service';
import { RouteLayerComponent } from './layers/route-layer/route-layer.component';

@Component({
  selector: 'scm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild(RouteLayerComponent) private routeLayerComponent: RouteLayerComponent;

  constructor() { }

  ngOnInit(): void {
  }

  createRouteLayer(formQueryResult: FormQueryResult) {
    this.routeLayerComponent.createRoutes(formQueryResult);
  }

}
