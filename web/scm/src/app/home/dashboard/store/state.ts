export interface DashboardState {
    heatmapLayers: string[];
    shapeLayers: string[];
    error: Error;
}

export const initialState: DashboardState = {
    heatmapLayers: [],
    shapeLayers: [],
    error: null
};
