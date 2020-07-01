import { createReducer, on, Action } from '@ngrx/store';
import { MapState, initialState } from './state';
import * as MapActions from './actions';
import { Layer, RouteLayerMarker, FilterFunction } from '../map.models';
import { FilterFormService } from '../../side-panel/services/filter-form.service';

const mapReducer = createReducer(
    initialState,
    on(MapActions.loadLayer, (state, { layer }) => ({
        ...state,
        isLoading: true
    })),
    on(MapActions.layerLoadSuccess, (state, { layer }) => ({
        ...state,
        layers: pushLayerToArray(layer, state.layers),
        isLoading: false
    })),
    on(MapActions.layerLoadFailure, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    })),
    on(MapActions.layerRemove, (state, { layer }) => ({
        ...state,
        layers: state.layers.filter(l => l.name !== layer.name),
        isLoading: false
    })),
    on(MapActions.addFilter, (state, { filterIdentifier, filter }) => ({
        ...state,
        filters: addFilterToObject(filterIdentifier, filter, state.filters)
    })),
    on(MapActions.removeFilter, (state, { filterIdentifier }) => ({
        ...state,
        filters: removeFilterFromObject(filterIdentifier, state.filters)
    }))
);

function pushLayerToArray(layer: Layer, layers: Layer[]) {
    layers = layers.filter(l => l.name !== layer.name );
    layers.push(layer);
    return layers;
}

function removeFilterFromObject(filterIdentifier: string, filters: { [key: string]: FilterFunction }): { [key: string]: FilterFunction } {
    const t = Object.assign({}, filters);
    delete t[filterIdentifier];
    return t;
}

function addFilterToObject(
    filterIdentifier: string,
    filter: FilterFunction,
    filters: { [key: string]: FilterFunction }): { [key: string]: FilterFunction } {
        const t = {};
        t[filterIdentifier] = filter;
        return Object.assign({}, filters, t);
}

export function reducer(state: MapState | undefined, action: Action) {
    return mapReducer(state, action);
}
