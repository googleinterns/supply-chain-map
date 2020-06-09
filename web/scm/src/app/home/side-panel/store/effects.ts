import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as FeatureActions from './actions';
import { FilterFormService } from 'src/app/home/side-panel/services/filter-form.service';
import { from, of } from 'rxjs';

@Injectable()
export class SidePanelStoreEffects {
    constructor(private filterFormService: FilterFormService, private actions$: Actions) { }

    initDataLoadEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(FeatureActions.sidePanelInitDataRequest),
            switchMap(
                () => {
                    return from(this.filterFormService.getFilterData())
                        .pipe(
                            map(
                                sidePanelData => FeatureActions.sidePanelInitDataSuccess({ sidePanel: sidePanelData })
                            ),
                            catchError(error => of(FeatureActions.sidePanelInitDataFailure({ error: error })))
                        );
                }
            )
        )
    );
}
