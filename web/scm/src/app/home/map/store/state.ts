import { Layer, RouteLayerMarker, FilterFunction } from '../map.models';

export interface MapState {
    layers: Layer[];
    filters: {
        identifier: string,
        isActive: boolean,
        filter: FilterFunction
    }[];
    error: Error;
    isLoading: boolean;
}

export const initialState: MapState = {
    layers: [],
    filters: [],
    error: null,
    isLoading: false
};
