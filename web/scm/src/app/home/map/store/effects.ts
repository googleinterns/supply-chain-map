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

    initDataLoadEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeFeatureActions.formQueryFetchSuccess),
            switchMap(
                ({ formQueryResult: formQueryResult }) => {
                    try {
                        const markers = this.mapHelperService.createMarkerPoints(formQueryResult);
                        const lines = this.mapHelperService.createLines(formQueryResult);
                        return of(MapFeatureActions.routeLayerLoadSuccess({ markers, lines }));
                    } catch (ex) {
                        return of(MapFeatureActions.routeLayerLoadFailure({ error: ex }));
                    }
                }
            )
        )
    );

}
