import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectDashboardAdditionalLayerNamess } from '../../../store/selectors';
import { MatListOption } from '@angular/material/list';
import { getAdditionalMapLayerNames } from '../../../store/actions';

@Component({
    selector: 'scm-layer-selection-dialog',
    templateUrl: './select-layer.dialog.html'
})
export class SelectLayerComponent {

    additionalLayerNames$: Observable<string[]>;
    selectedLayers: string[] = [];

    constructor(private store: Store) {
        this.store.dispatch(getAdditionalMapLayerNames());
        this.additionalLayerNames$ = this.store.select(selectDashboardAdditionalLayerNamess);
    }

    setSelectedLayers(options: MatListOption[]) {
        this.selectedLayers = options.map(o => o.value);
    }
}
