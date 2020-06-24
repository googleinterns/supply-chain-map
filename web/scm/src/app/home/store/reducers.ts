import { createReducer, on, Action } from '@ngrx/store';
import { HomeState, initialState } from './state';
import * as HomeActions from './actions';
import { FormQueryResult } from '../home.models';

const homeReducer = createReducer(
    initialState,
    on(HomeActions.formQueryGenerated, (state, { formQuery }) => ({
        ...state,
        formQuery: formQuery,
        isLoading: true
    })),
    on(HomeActions.formQueryFetchSuccess, (state, { formQueryResponse }) => ({
        ...state,
        formQueryResult: formQueryResponse.formQueryResult,
        formQueryResultSchema: formQueryResponse.formQueryResultSchema,
        formQueryResultStats: formQueryResponse.formQueryResultStats,
        isLoading: false
    })),
    on(HomeActions.formQueryFetchFailure, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    })),
    on(HomeActions.skuFilterFormQueryResult, (state, { sku }) => ({
        ...state,
        formQueryResult: skuFilterFormQueryResultHelper(state.formQueryResult, sku)
    }))
);

function skuFilterFormQueryResultHelper(formQueryResult: FormQueryResult, sku: Set<string>): FormQueryResult {
    return {
        cm: formQueryResult.cm.filter(cm => sku.has(cm.sku)),
        upstream: formQueryResult.upstream.filter(upstream => sku.has(upstream.parent_sku)),
        downstream: formQueryResult.downstream.filter(downstream => sku.has(downstream.sku))
    };
}

export function reducer(state: HomeState | undefined, action: Action) {
    return homeReducer(state, action);
}
