import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as DashboardFeatureActions from './actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { DashboardHelperService } from '../services/dashboard-helper.service';

@Injectable()
export class DashboardStoreEffects {
    constructor(private dashboardHelperService: DashboardHelperService, private actions$: Actions) { }

    fetchAdditionalLayerNames$ = createEffect(
        () => this.actions$.pipe(
            ofType(DashboardFeatureActions.getAdditionalMapLayerNames),
            switchMap(
                () => {
                    return from(this.dashboardHelperService.getAdditionalLayers())
                        .pipe(
                            map(
                                layers => DashboardFeatureActions.getAdditionalMapLayerNamesSuccess({
                                    heatmapLayers: layers.heatmap,
                                    shapeLayers: layers.shape
                                })
                            ),
                            catchError(error => of(DashboardFeatureActions.getAdditionalMapLayerNamesFailure({ error: error })))
                        );
                }
            )
        )
    );

}
