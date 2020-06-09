import { createReducer, on, Action } from '@ngrx/store';
import { MapState, initialState } from './state';
import * as MapActions from './actions';

const mapReducer = createReducer(
    initialState,
    on(MapActions.routeLayerLoadSuccess, (state, { markers, lines }) => ({
        ...state,
        routeLayerMarkers: markers,
        routeLayerLines: lines
    })),
    on(MapActions.routeLayerLoadFailure, (state, { error }) => ({
        ...state,
        error: error
    }))
);

export function reducer(state: MapState | undefined, action: Action) {
    return mapReducer(state, action);
}
