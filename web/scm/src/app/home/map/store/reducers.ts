import { createReducer, on, Action } from '@ngrx/store';
import { MapState, initialState } from './state';
import * as MapActions from './actions';
import { Layer, FilterFunction } from '../map.models';

const mapReducer = createReducer(
    initialState,
    on(MapActions.loadLayer, (state) => ({
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
        filters: state.filters.filter(f => f.identifier !== filterIdentifier)
    })),
    on(MapActions.activateFilter, (state, { filterIdentifier }) => ({
        ...state,
        filters: setFilterActiveStatus(filterIdentifier, true, state.filters)
    })),
    on(MapActions.deactivateFilter, (state, { filterIdentifier }) => ({
        ...state,
        filters: setFilterActiveStatus(filterIdentifier, false, state.filters)
    }))
);

function pushLayerToArray(layer: Layer, layers: Layer[]) {
    layers = layers.filter(l => l.name !== layer.name);
    layers.push(layer);
    return layers;
}

function setFilterActiveStatus(
    filterIdentifier: string,
    status: boolean,
    filters: { identifier: string, isActive: boolean, filter: FilterFunction }[])
    : { identifier: string, isActive: boolean, filter: FilterFunction }[] {
    const updatedFilters = [];
    for (const filter of filters) {
        const updatedFilter = Object.assign({}, filter);
        if (filter.identifier === filterIdentifier) {
            updatedFilter.isActive = status;
        }
        updatedFilters.push(updatedFilter);
    }
    return updatedFilters;
}

function addFilterToObject(
    filterIdentifier: string,
    filter: FilterFunction,
    filters: { identifier: string, isActive: boolean, filter: FilterFunction }[])
    : { identifier: string, isActive: boolean, filter: FilterFunction }[] {
    filters = filters.filter(f => f.identifier !== filterIdentifier);
    filters.push({
        identifier: filterIdentifier,
        isActive: false,
        filter: filter
    });
    return filters;
}

export function reducer(state: MapState | undefined, action: Action) {
    return mapReducer(state, action);
}
