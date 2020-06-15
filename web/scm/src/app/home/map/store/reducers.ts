import { createReducer, on, Action } from '@ngrx/store';
import { MapState, initialState } from './state';
import * as MapActions from './actions';
import { RouteLayer, AdditionalLayer } from '../map.models';

const mapReducer = createReducer(
    initialState,
    on(MapActions.routeLayerLoadSuccess, (state, { layer }) => ({
        ...state,
        routeLayer: layer
    })),
    on(MapActions.routeLayerLoadFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MapActions.additionalLayerLoadSuccess, (state, { layer }) => ({
        ...state,
        additionalLayers: pushLayerToArray(layer, state.additionalLayers)
    })),
    on(MapActions.additionalLayerLoadFailure, (state, { error }) => ({
        ...state,
        error: error
    }))
);

function pushLayerToArray(layer: AdditionalLayer, layers: (AdditionalLayer)[]): (AdditionalLayer)[] {
    layers = layers.filter(l => l.name !== layer.name );
    layers.push(layer);
    return layers;
}

export function reducer(state: MapState | undefined, action: Action) {
    return mapReducer(state, action);
}
