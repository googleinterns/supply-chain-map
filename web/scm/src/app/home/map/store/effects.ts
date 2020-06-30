import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import * as MapFeatureActions from './actions';
import * as HomeFeatureActions from '../../store/actions';
import { MapHelperService } from '../services/map-helper/map-helper.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { RouteLayer } from '../map.models';

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
                        const routeLayer: RouteLayer = {
                            name: 'Route Layer',
                            markers: markers,
                            lines: lines,
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
                            }, {
                                name: 'MFG & CM',
                                icon: MapHelperService.ICON_MAP.MFG_CM,
                                type: 'URL'
                            }]
                        };
                        return of(MapFeatureActions.layerLoadSuccess({ layer: routeLayer }));
                    } catch (ex) {
                        return of(MapFeatureActions.layerLoadFailure({ error: ex }));
                    }
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
    )

}
