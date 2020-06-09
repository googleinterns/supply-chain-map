import { RouteLayerMarker, RouteLayerLine } from '../map.models';

export interface MapState {
    routeLayerMarkers: RouteLayerMarker[];
    routeLayerLines: RouteLayerLine[];
    error: Error;
    isLoading: boolean;
}

export const initialState: MapState = {
    routeLayerMarkers: [],
    routeLayerLines: [],
    error: null,
    isLoading: false
};
