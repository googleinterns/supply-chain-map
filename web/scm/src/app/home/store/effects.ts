import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as HomeFeatureActions from './actions';
import { HomeHelperService } from '../services/home-helper/home-helper.service';
import { switchMap, map, catchError, concatMap, withLatestFrom } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectHomeFormQueryResult, selectHomeState } from './selectors';
import { environment } from 'src/environments/environment';

@Injectable()
export class HomeStoreEffects {
    constructor(private homeHelperService: HomeHelperService, private actions$: Actions, private store: Store) { }

    fetchFormQueryDataEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeFeatureActions.formQueryGenerated),
            switchMap(
                ({ formQuery }) => {
                    return from(this.homeHelperService.runFormQuery(formQuery))
                        .pipe(
                            map(
                                formQueryResponse => HomeFeatureActions.formQueryFetchSuccess({ formQueryResponse: formQueryResponse })
                            ),
                            catchError(error => of(HomeFeatureActions.formQueryFetchFailure({ error: error })))
                        );
                }
            )
        )
    );

    filterFormQueryDataEffect$ = createEffect(
        () => this.actions$.pipe(
            ofType(HomeFeatureActions.skuFilterFormQueryResult),
            withLatestFrom(this.store.select(selectHomeFormQueryResult)),
            switchMap(
                ([{ sku }, formQueryResult]) => {
                    try {
                        const UPSTREAM_PARENT_SKU = environment.bigQuery.layerDatasets.route.tables.UPSTREAM.columns.PARENT_SKU;
                        const CM_SKU = environment.bigQuery.layerDatasets.route.tables.CM.columns.SKU;
                        const DOWNSTREAM_SKU = environment.bigQuery.layerDatasets.route.tables.DOWNSTREAM.columns.SKU;
                        const filteredFormQueryResult = {
                            cm: formQueryResult.cm.filter(cm => sku.has(cm[CM_SKU])),
                            upstream: formQueryResult.upstream.filter(upstream => sku.has(upstream[UPSTREAM_PARENT_SKU])),
                            downstream: formQueryResult.downstream.filter(downstream => sku.has(downstream[DOWNSTREAM_SKU]))
                        };
                        return of(HomeFeatureActions.skuFilterFormQueryResultSuccess({
                            formQueryResponse: {
                                formQueryResult: filteredFormQueryResult
                            }
                        }));
                    } catch (ex) {
                        return of(HomeFeatureActions.formQueryFetchFailure(ex));
                    }
                }
            )
        )
    );

}
