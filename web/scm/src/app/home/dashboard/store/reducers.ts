import { createReducer, on, Action } from '@ngrx/store';
import { DashboardState, initialState } from './state';
import * as DashboardActions from './actions';

const dashboardReducer = createReducer(
    initialState,
    on(DashboardActions.getAdditionalMapLayerNamesSuccess, (state, { additionalLayerNames }) => ({
        ...state,
        additionalLayerNames: additionalLayerNames
    })),
    on(DashboardActions.getAdditionalMapLayerNamesFailure, (state, { error }) => ({
        ...state,
        error: error
    }))
);

export function reducer(state: DashboardState | undefined, action: Action) {
    return dashboardReducer(state, action);
}