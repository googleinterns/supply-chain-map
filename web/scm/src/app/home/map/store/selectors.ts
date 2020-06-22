import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { MapState } from './state';
import { Layer } from '../map.models';

const isLoading = (state: MapState) => state.isLoading;
const getError = (state: MapState) => state.error;
const getLayers = (state: MapState) => state.layers;

export const selectMapState: MemoizedSelector<object, MapState> = createFeatureSelector<MapState>('map');

export const selectMapIsLoading: MemoizedSelector<MapState, boolean> = createSelector(selectMapState, isLoading);
export const selectMapError: MemoizedSelector<MapState, Error> = createSelector(selectMapState, getError);
export const selectMapLayers: MemoizedSelector<MapState, Layer[]> = createSelector(selectMapState, getLayers);

export function selectMapLayer(name: string): MemoizedSelector<MapState, Layer> {
    return createSelector(
        selectMapState,
        state => state.layers.find(layer => layer.name === name)
    );
}
