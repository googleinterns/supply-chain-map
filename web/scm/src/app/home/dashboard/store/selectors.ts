import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { DashboardState } from './state';

const getAdditionalLayerNames = (state: DashboardState) => state.additionalLayerNames;
const getError = (state: DashboardState) => state.error;

export const selectDashboardState: MemoizedSelector<object, DashboardState> = createFeatureSelector<DashboardState>('dashboard');

export const selectDashboardAdditionalLayerNamess: MemoizedSelector<DashboardState, string[]> =
createSelector(selectDashboardState, getAdditionalLayerNames);
export const selectDashboardError: MemoizedSelector<DashboardState, Error> = createSelector(selectDashboardState, getError);
