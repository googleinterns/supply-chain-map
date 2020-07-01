import { Layer, RouteLayerMarker, FilterFunction } from '../map.models';

export interface MapState {
    layers: Layer[];
    filters: {
        [key: string]: FilterFunction
    };
    error: Error;
    isLoading: boolean;
}

export const initialState: MapState = {
    layers: [],
    filters: {},
    error: null,
    isLoading: false
};
