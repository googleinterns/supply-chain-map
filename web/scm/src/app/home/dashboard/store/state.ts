export interface DashboardState {
    additionalLayerNames: string[];
    error: Error;
}

export const initialState: DashboardState = {
    additionalLayerNames: [],
    error: null
};
