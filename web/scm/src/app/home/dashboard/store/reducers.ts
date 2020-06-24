import { createReducer, on, Action } from '@ngrx/store';
import { DashboardState, initialState } from './state';
import * as DashboardActions from './actions';

const dashboardReducer = createReducer(
    initialState,
    on(DashboardActions.getAdditionalMapLayerNames, (state) => ({
        ...state,
        isLoading: true
    })),
    on(DashboardActions.getAdditionalMapLayerNamesSuccess, (state, { heatmapLayers, shapeLayers }) => ({
        ...state,
        heatmapLayers: heatmapLayers,
        shapeLayers: shapeLayers,
        isLoading: false
    })),
    on(DashboardActions.getAdditionalMapLayerNamesFailure, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    }))
);

export function reducer(state: DashboardState | undefined, action: Action) {
    return dashboardReducer(state, action);
}
