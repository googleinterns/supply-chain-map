import { Layer } from '../map.models';

export interface MapState {
    layers: Layer[];
    error: Error;
    isLoading: boolean;
}

export const initialState: MapState = {
    layers: [
        {
            name: 'Base Map',
            deletable: false
        }
    ],
    error: null,
    isLoading: false
};
