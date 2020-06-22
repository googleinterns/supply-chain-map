import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { DashboardState } from './state';

const getAdditionalHeatmapLayerNames = (state: DashboardState) => state.additionalHeatmapLayerNames;
const getError = (state: DashboardState) => state.error;

export const selectDashboardState: MemoizedSelector<object, DashboardState> = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardAdditionalLayerNamess: MemoizedSelector<DashboardState, string[]> =
createSelector(selectDashboardState, getAdditionalHeatmapLayerNames);
export const selectDashboardError: MemoizedSelector<DashboardState, Error> = createSelector(selectDashboardState, getError);
