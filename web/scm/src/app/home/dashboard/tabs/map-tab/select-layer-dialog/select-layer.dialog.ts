import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatListOption } from '@angular/material/list';
import { getAdditionalMapLayerNames } from '../../../store/actions';
import { selectDashboardHeatmapLayerNames, selectDashboardShapeLayerNames } from '../../../store/selectors';

@Component({
    selector: 'scm-layer-selection-dialog',
    templateUrl: './select-layer.dialog.html'
})
export class SelectLayerComponent {

    heatmapLayers$: Observable<string[]>;
    shapeLayers$: Observable<string[]>;
    selectedLayer: { type: string, name: string };

    constructor(private store: Store) {
        this.store.dispatch(getAdditionalMapLayerNames());
        this.heatmapLayers$ = this.store.select(selectDashboardHeatmapLayerNames);
        this.shapeLayers$ = this.store.select(selectDashboardShapeLayerNames);
    }

    setSelectedLayers(options: MatListOption[]) {
        this.selectedLayer = { type: options[0].value, name: options[0]._text.nativeElement.innerText};
    }
}
