import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as HomeFeatureActions from './actions';
import { HomeHelperService } from '../services/home-helper/home-helper.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Injectable()
export class HomeStoreEffects {
    constructor(private homeHelperService: HomeHelperService, private actions$: Actions) { }

    fetchFormQueryDataEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeFeatureActions.formQueryGenerated),
            switchMap(
                ({ formQuery }) => {
                    return from(this.homeHelperService.runFormQuery(formQuery))
                        .pipe(
                            map(
                                formQueryResult => HomeFeatureActions.formQueryFetchSuccess({ formQueryResult: formQueryResult })
                            ),
                            catchError(error => of(HomeFeatureActions.formQueryFetchFailure({ error: error })))
                        );
                }
            )
        )
    );

}
