import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { MapState } from './state';
import { RouteLayerMarker, RouteLayerLine } from '../map.models';

const isLoading = (state: MapState) => state.isLoading;
const getError = (state: MapState) => state.error;
const getRouteLayerMarkers = (state: MapState) => state.routeLayerMarkers;
const getRouteLayerLines = (state: MapState) => state.routeLayerLines;

export const selectMapState: MemoizedSelector<object, MapState> = createFeatureSelector<MapState>('map');

export const selectMapIsLoading: MemoizedSelector<MapState, boolean> = createSelector(selectMapState, isLoading);
export const selectMapError: MemoizedSelector<MapState, Error> = createSelector(selectMapState, getError);
export const selectMapRouteLayerMarkers: MemoizedSelector<MapState, RouteLayerMarker[]> =
createSelector(selectMapState, getRouteLayerMarkers);
export const selectMapRouteLayerLines: MemoizedSelector<MapState, RouteLayerLine[]> =
createSelector(selectMapState, getRouteLayerLines);
