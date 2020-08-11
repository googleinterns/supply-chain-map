import { FormQueryResponse, FormQueryResult, FormQueryResultStats } from '../../home.models';

export interface DashboardState {
    dashboardData: FormQueryResult;
    dashboardStats: FormQueryResultStats;
    heatmapLayers: string[];
    shapeLayers: string[];
    error: Error;
    isLoading: boolean;
}

export const initialState: DashboardState = {
    dashboardData: {
        upstream: [],
        cm: [],
        downstream: []
    },
    dashboardStats: null,
    heatmapLayers: [],
    shapeLayers: [],
    error: null,
    isLoading: false
};
