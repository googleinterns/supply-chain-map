import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { DashboardState } from './state';
import { FormQueryResult } from '../../home.models';

const getDashboardData = (state: DashboardState) => state.dashboardData;
const getHeatmapLayerNames = (state: DashboardState) => state.heatmapLayers;
const getShapeLayerNames = (state: DashboardState) => state.shapeLayers;
const getIsLoading = (state: DashboardState) => state.isLoading;
const getError = (state: DashboardState) => state.error;

export const selectDashboardState: MemoizedSelector<object, DashboardState> = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardData: MemoizedSelector<DashboardState, FormQueryResult> =
createSelector(selectDashboardState, getDashboardData);
export const selectDashboardHeatmapLayerNames: MemoizedSelector<DashboardState, string[]> =
createSelector(selectDashboardState, getHeatmapLayerNames);
export const selectDashboardShapeLayerNames: MemoizedSelector<DashboardState, string[]> =
createSelector(selectDashboardState, getShapeLayerNames);
export const selectDashboardIsLoading: MemoizedSelector<DashboardState, boolean> = createSelector(selectDashboardState, getIsLoading);
export const selectDashboardError: MemoizedSelector<DashboardState, Error> = createSelector(selectDashboardState, getError);
