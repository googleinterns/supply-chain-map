import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouteLayerComponent } from './layers/route-layer/route-layer.component';
import { LineComponent } from './line/line.component';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [
    MapComponent,
    RouteLayerComponent,
    LineComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApi
    }),
    CommonModule
  ],
  exports: [
    MapComponent,
    RouteLayerComponent,
    LineComponent
  ]
})
export class MapModule { }
