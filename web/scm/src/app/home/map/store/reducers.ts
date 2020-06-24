import { createReducer, on, Action } from '@ngrx/store';
import { MapState, initialState } from './state';
import * as MapActions from './actions';
import { Layer } from '../map.models';

const mapReducer = createReducer(
    initialState,
    on(MapActions.layerLoadSuccess, (state, { layer }) => ({
        ...state,
        layers: pushLayerToArray(layer, state.layers)
    })),
    on(MapActions.layerLoadFailure, (state, { error }) => ({
        ...state,
        error: error
    })),
    on(MapActions.layerRemove, (state, { layer }) => ({
        ...state,
        layers: state.layers.filter(l => l.name !== layer.name)
    }))
);

function pushLayerToArray(layer: Layer, layers: Layer[]) {
    layers = layers.filter(l => l.name !== layer.name );
    layers.push(layer);
    return layers;
}

export function reducer(state: MapState | undefined, action: Action) {
    return mapReducer(state, action);
}
