import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import * as MapFeatureActions from './actions';
import * as HomeFeatureActions from '../../store/actions';
import { MapHelperService } from '../services/map-helper/map-helper.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Injectable()
export class MapStoreEffects {
    constructor(private mapHelperService: MapHelperService, private actions$: Actions) { }

    initRouteLayerDataEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeFeatureActions.formQueryFetchSuccess),
            switchMap(
                ({ formQueryResponse }) => {
                    try {
                        const markers = this.mapHelperService.createMarkerPoints(formQueryResponse.formQueryResult);
                        const lines = this.mapHelperService.createLines(formQueryResponse.formQueryResult);
                        return of(MapFeatureActions.routeLayerLoadSuccess({ layer: {
                            name: 'Route Layer',
                            markers: markers,
                            lines: lines
                        } }));
                    } catch (ex) {
                        return of(MapFeatureActions.routeLayerLoadFailure({ error: ex }));
                    }
                }
            )
        )
    );

    loadAdditionalLayer$ = createEffect(
        () => this.actions$.pipe(
            ofType(MapFeatureActions.loadAdditionalLayer),
            switchMap(
                ({ layerName }) => {
                    return from(this.mapHelperService.getAdditionalLayer(layerName))
                    .pipe(
                        map(
                            layer => MapFeatureActions.additionalLayerLoadSuccess({ layer: layer })
                        ),
                        catchError(error => of(MapFeatureActions.additionalLayerLoadFailure({ error: error })))
                    );
                }
            )
        )
    )

}
