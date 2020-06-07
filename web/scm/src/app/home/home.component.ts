import { Component, ViewChild } from '@angular/core';
import { HomeHelperService, FormQueryResult } from '../services/home-helper/home-helper.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'scm-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(private homeHelper: HomeHelperService) { }

  public queryGenerated(query: string) {
    this.homeHelper.runFormQuery(query)
    .then(
      formQueryResult => this.mapComponent.createRouteLayer(formQueryResult)
    );
  }
}
