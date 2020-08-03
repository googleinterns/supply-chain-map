import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { HomeState } from './state';
import { FormQueryResult, FormQueryResultStats } from '../home.models';
import { FilterFunction } from '../map/map.models';

const isLoading = (state: HomeState) => state.isLoading;
const getError = (state: HomeState) => state.error;
const getSidePanelWidth = (state: HomeState) => state.sidePanelWidth;
const getDashboardHeight = (state: HomeState) => state.dashboardHeight;
const getFormQuery = (state: HomeState) => state.formQuery;
const getFormQueryResult = (state: HomeState) => state.formQueryResult;
const getOriginalFormQueryResult = (state: HomeState) => state.originalFormQueryResult;
const getFormQueryResultStats = (state: HomeState) => state.formQueryResultStats;
const getOriginalFormQueryResultAndFilters = (state: HomeState) => ({
    formQueryResult: state.originalFormQueryResult,
    filters: getFilters(state)
});
const getFilters = (state: HomeState) => state.filters.filter(f => f.isActive).map(f => f.filter);

export const selectHomeState: MemoizedSelector<object, HomeState> = createFeatureSelector<HomeState>('home');

export const selectHomeIsLoading: MemoizedSelector<HomeState, boolean> = createSelector(selectHomeState, isLoading);
export const selectHomeError: MemoizedSelector<HomeState, Error> = createSelector(selectHomeState, getError);
export const selectSidePanelWidth: MemoizedSelector<HomeState, number> = createSelector(selectHomeState, getSidePanelWidth);
export const selectDashboardHeight: MemoizedSelector<HomeState, number> = createSelector(selectHomeState, getDashboardHeight);
export const selectHomeFormQuery: MemoizedSelector<HomeState, string> =
createSelector(selectHomeState, getFormQuery);
export const selectHomeFormQueryResult: MemoizedSelector<HomeState, FormQueryResult> =
createSelector(selectHomeState, getFormQueryResult);
export const selectHomeOriginalFormQueryResult: MemoizedSelector<HomeState, FormQueryResult> =
createSelector(selectHomeState, getOriginalFormQueryResult);
export const selectHomeFormQueryResultStats: MemoizedSelector<HomeState, FormQueryResultStats> =
createSelector(selectHomeState, getFormQueryResultStats);
export const selectHomeFormQueryResultAndFilters: MemoizedSelector<HomeState, {
    formQueryResult: FormQueryResult,
    filters: FilterFunction[]
}>
= createSelector(selectHomeState, getOriginalFormQueryResultAndFilters);
export const selectHomeFilters: MemoizedSelector<HomeState, FilterFunction[]> = createSelector(selectHomeState, getFilters);
