import { AdditionalLayer, RouteLayer } from '../map.models';

export interface MapState {
    routeLayer?: RouteLayer;
    additionalLayers: (AdditionalLayer)[];
    error: Error;
    isLoading: boolean;
}

export const initialState: MapState = {
    additionalLayers: [
    ],
    error: null,
    isLoading: false
};
