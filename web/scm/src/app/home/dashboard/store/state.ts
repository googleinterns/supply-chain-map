export interface DashboardState {
    additionalHeatmapLayerNames: string[];
    error: Error;
}

export const initialState: DashboardState = {
    additionalHeatmapLayerNames: [],
    error: null
};
