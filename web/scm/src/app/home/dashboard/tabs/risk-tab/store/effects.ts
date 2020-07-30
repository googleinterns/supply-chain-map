import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { formQueryFetchSuccess } from 'src/app/home/store/actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { from, of, pipe } from 'rxjs';
import { RiskTabHelperService } from '../services/risk-tab-helper.service';
import * as RiskActions from './actions';

@Injectable()
export class RiskStoreEffects {
    constructor(private riskTabHelperService: RiskTabHelperService, private actions$: Actions) { }

    fetchRiskData$ = createEffect(
        () => this.actions$.pipe(
            ofType(formQueryFetchSuccess),
            switchMap(
                () => {
                    return from(this.riskTabHelperService.getRiskData())
                        .pipe(
                            map(
                                riskData => RiskActions.riskQueryFetchSuccess({ rows: riskData })
                            ),
                            catchError(error => of(RiskActions.riskQueryFetchFailure({ error: error })))
                        );
                }
            )
        )
    );
}
