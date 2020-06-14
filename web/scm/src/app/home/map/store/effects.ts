import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, createEffect } from '@ngrx/effects';
import * as MapFeatureActions from './actions';
import * as HomeFeatureActions from '../../store/actions';
import { MapHelperService } from '../services/map-helper/map-helper.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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
                        return of(MapFeatureActions.layerLoadSuccess({ layer: {
                            name: 'Route Layer',
                            data: {
                                routeLayerMarkers: markers,
                                routeLayerLines: lines
                            },
                            deletable: true
                        } }));
                    } catch (ex) {
                        return of(MapFeatureActions.layerLoadFailure({ error: ex }));
                    }
                }
            )
        )
    );

}
