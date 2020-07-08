import { Layer, RouteLayerMarker, FilterFunction } from '../map.models';

export interface MapState {
    layers: Layer[];
    error: Error;
    isLoading: boolean;
}

export const initialState: MapState = {
    layers: [],
    error: null,
    isLoading: false
};
