import { createReducer, on, Action } from '@ngrx/store';
import { HomeState, initialState } from './state';
import * as HomeActions from './actions';

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
        formQueryResultStats: formQueryResponse.formQueryResultStats,
        isLoading: false
    })),
    on(HomeActions.formQueryFetchFailure, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    })),
    on(HomeActions.invalidServiceAccount, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    }))
);

export function reducer(state: HomeState | undefined, action: Action) {
    return homeReducer(state, action);
}
