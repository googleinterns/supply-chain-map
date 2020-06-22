import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SelectLayerComponent } from './select-layer-dialog/select-layer.dialog';
import { Layer } from 'src/app/home/map/map.models';
import { selectMapLayers } from 'src/app/home/map/store/selectors';
import { loadLayer } from 'src/app/home/map/store/actions';

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
      layers => {
        for (const layer of layers) {
          this.store.dispatch(loadLayer({ layer: { name: layer } }));
        }
      }
    );
  }
}
