import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { RouteLayerComponent } from './layers/route-layer/route-layer.component';
import { LineComponent } from './line/line.component';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import * as fromMap from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { MapStoreEffects } from './store/effects';
import { HeatmapLayerComponent } from './layers/heatmap-layer/heatmap-layer.component';
import { ShapeLayerComponent } from './layers/shape-layer/shape-layer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    HeatmapLayerComponent,
    MapComponent,
    RouteLayerComponent,
    LineComponent,
    ShapeLayerComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApi,
      libraries: ['visualization']
    }),
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature('map', fromMap.reducer),
    EffectsModule.forFeature([MapStoreEffects])
  ],
  exports: [
    MapComponent,
    RouteLayerComponent,
    LineComponent
  ]
})
export class MapModule { }
