import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectLayerComponent } from './select-layer-dialog/select-layer.dialog';
import { loadAdditionalLayer } from 'src/app/home/map/store/actions';
import { AdditionalLayer, RouteLayer } from 'src/app/home/map/map.models';
import { selectMapAdditionalLayers, selectMapRouteLayer } from 'src/app/home/map/store/selectors';

@Component({
  selector: 'scm-map-tab',
  templateUrl: './map-tab.component.html',
  styleUrls: ['./map-tab.component.scss']
})
export class MapTabComponent implements OnInit {

  additionalLayers$: Observable<AdditionalLayer[]>;
  routeLayer$: Observable<RouteLayer>;

  constructor(private store: Store, public matDialog: MatDialog) {
    this.additionalLayers$ = this.store.select(selectMapAdditionalLayers);
    this.routeLayer$ = this.store.select(selectMapRouteLayer);
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.matDialog.open(SelectLayerComponent);

    dialogRef.afterClosed().subscribe(
      layers => {
        for (const layer of layers) {
          this.store.dispatch(loadAdditionalLayer({ layerName: layer }));
        }
      }
    );
  }
}
