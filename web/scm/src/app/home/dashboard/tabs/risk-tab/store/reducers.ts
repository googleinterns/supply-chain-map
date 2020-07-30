import { createReducer, Action, on } from '@ngrx/store';
import { initialState, RiskState } from './state';
import * as RiskActions from './actions';

const riskReducer = createReducer(
    initialState,
    on(RiskActions.riskQueryFetchSuccess, (state, { rows }) => ({
        ...state,
        riskQueryResult: rows
    })),
    on(RiskActions.riskQueryFetchFailure, (state, { error }) => ({
        ...state,
        error: error
    }))
);

export function reducer(state: RiskState | undefined, action: Action) {
    return riskReducer(state, action);
}
