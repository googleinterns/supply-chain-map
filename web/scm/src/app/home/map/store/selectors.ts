import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { MapState } from './state';
import { AdditionalLayer, RouteLayer } from '../map.models';

const isLoading = (state: MapState) => state.isLoading;
const getError = (state: MapState) => state.error;
const getRouteLayer = (state: MapState) => state.routeLayer;
const getAdditionalLayers = (state: MapState) => state.additionalLayers;

export const selectMapState: MemoizedSelector<object, MapState> = createFeatureSelector<MapState>('map');

export const selectMapIsLoading: MemoizedSelector<MapState, boolean> = createSelector(selectMapState, isLoading);
export const selectMapError: MemoizedSelector<MapState, Error> = createSelector(selectMapState, getError);
export const selectMapAdditionalLayers: MemoizedSelector<MapState, AdditionalLayer[]> = createSelector(selectMapState, getAdditionalLayers);
export const selectMapRouteLayer: MemoizedSelector<MapState, RouteLayer> = createSelector(selectMapState, getRouteLayer);

export function selectMapAdditionalLayer(name: string): MemoizedSelector<MapState, AdditionalLayer> {
    return createSelector(
        selectMapState,
        state => state.additionalLayers.find(layer => layer.name === name)
    );
}