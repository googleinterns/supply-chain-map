import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectLayerComponent } from './select-layer-dialog/select-layer.dialog';
import { Layer } from 'src/app/home/map/map.models';
import { selectMapLayers } from 'src/app/home/map/store/selectors';
import { loadLayer, layerRemove } from 'src/app/home/map/store/actions';
import { deactivateFilter, activateFilter } from 'src/app/home/store/actions';

@Component({
  selector: 'scm-map-tab',
  templateUrl: './map-tab.component.html',
  styleUrls: ['./map-tab.component.scss']
})
export class MapTabComponent implements OnInit {

  layers$: Observable<Layer[]>;

  constructor(private store: Store, public matDialog: MatDialog) {
    this.layers$ = this.store.select(selectMapLayers);
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.matDialog.open(SelectLayerComponent);

    dialogRef.afterClosed().subscribe(
      selectedLayer => {
        let layer;
        switch (selectedLayer.type) {
          case 'heatmap': layer = { name: selectedLayer.name, hotspots: [] }; break;
          case 'shape': layer = { name: selectedLayer.name, shapes: [] }; break;
        }
        this.store.dispatch(loadLayer({ layer: layer }));
      }
    );
  }

  removeLayer(layer: Layer) {
    this.store.dispatch(layerRemove({ layer: layer }));
  }

  toggleStatus($event, layerName) {
    const isActive = $event.target.classList.contains('filter-active');

    if (isActive) {
      $event.target.classList.remove('filter-active');
      this.store.dispatch(deactivateFilter({ filterIdentifier: layerName }));
    } else {
      $event.target.classList.add('filter-active');
      this.store.dispatch(activateFilter({ filterIdentifier: layerName }));
    }
  }
}
