import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatListOption } from '@angular/material/list';
import { getAdditionalMapLayerNames } from '../../../store/actions';
import { selectDashboardHeatmapLayerNames, selectDashboardShapeLayerNames, selectDashboardIsLoading, selectDashboardError } from '../../../store/selectors';

@Component({
    selector: 'scm-layer-selection-dialog',
    templateUrl: './select-layer.dialog.html',
    styleUrls: ['./select-layer.dialog.scss']
})
export class SelectLayerComponent {

    heatmapLayers$: Observable<string[]>;
    shapeLayers$: Observable<string[]>;
    selectedLayer: { type: string, name: string };
    isLoading$: Observable<boolean>;
    error$: Observable<Error>;


    constructor(private store: Store) {
        this.store.dispatch(getAdditionalMapLayerNames());
        this.heatmapLayers$ = this.store.select(selectDashboardHeatmapLayerNames);
        this.shapeLayers$ = this.store.select(selectDashboardShapeLayerNames);
        this.isLoading$ = this.store.select(selectDashboardIsLoading);
        this.error$ = this.store.select(selectDashboardError);
    }

    setSelectedLayers(options: MatListOption[]) {
        this.selectedLayer = { type: options[0].value, name: options[0]._text.nativeElement.innerText};
    }
}
