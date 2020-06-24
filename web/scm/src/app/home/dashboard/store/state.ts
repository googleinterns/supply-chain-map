export interface DashboardState {
    heatmapLayers: string[];
    shapeLayers: string[];
    error: Error;
    isLoading: boolean;
}

export const initialState: DashboardState = {
    heatmapLayers: [],
    shapeLayers: [],
    error: null,
    isLoading: false
};
