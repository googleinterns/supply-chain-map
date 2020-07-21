import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as MapFeatureActions from './actions';
import * as HomeFeatureActions from '../../store/actions';
import { MapHelperService } from '../services/map-helper/map-helper.service';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { ROUTE_LAYER_NAME, Layer } from '../map.models';

@Injectable()
export class MapStoreEffects {
    constructor(private mapHelperService: MapHelperService, private actions$: Actions) { }

    initFormQueryResultEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeFeatureActions.formQueryFetchSuccess),
            switchMap(
                () => {
                    const routeLayer: Layer = {
                        name: ROUTE_LAYER_NAME,
                        legend: [{
                            name: 'MFG',
                            icon: MapHelperService.ICON_MAP.MFG,
                            type: 'URL'
                        }, {
                            name: 'CM',
                            icon: MapHelperService.ICON_MAP.CM,
                            type: 'URL'
                        }, {
                            name: 'GDC',
                            icon: MapHelperService.ICON_MAP.GDC,
                            type: 'URL'
                        }]
                    };
                    return of(MapFeatureActions.layerLoadSuccess({ layer: routeLayer }));
                }
            )
        )
    );

    loadAdditionalLayer$ = createEffect(
        () => this.actions$.pipe(
            ofType(MapFeatureActions.loadLayer),
            switchMap(
                ({ layer }) => {
                    return from(this.mapHelperService.getLayer(layer))
                        .pipe(
                            map(
                                loadedLayer => MapFeatureActions.layerLoadSuccess({ layer: loadedLayer })
                            ),
                            catchError(error => of(MapFeatureActions.layerLoadFailure({ error: error })))
                        );
                }
            )
        )
    );

}
