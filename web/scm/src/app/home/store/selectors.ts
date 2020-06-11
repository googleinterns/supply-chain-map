import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { HomeState } from './state';
import { FormQueryResult, FormQueryResultSchema, FormQueryResultStats } from '../home.models';

const isLoading = (state: HomeState) => state.isLoading;
const getError = (state: HomeState) => state.error;
const getFormQuery = (state: HomeState) => state.formQuery;
const getFormQueryResult = (state: HomeState) => state.formQueryResult;
const getFormQueryResultSchema = (state: HomeState) => state.formQueryResultSchema;
const getFormQueryResultStats = (state: HomeState) => state.formQueryResultStats;

export const selectHomeState: MemoizedSelector<object, HomeState> = createFeatureSelector<HomeState>('home');

export const selectHomeIsLoading: MemoizedSelector<HomeState, boolean> = createSelector(selectHomeState, isLoading);
export const selectHomeError: MemoizedSelector<HomeState, Error> = createSelector(selectHomeState, getError);
export const selectHomeFormQuery: MemoizedSelector<HomeState, string> =
createSelector(selectHomeState, getFormQuery);
export const selectHomeFormQueryResult: MemoizedSelector<HomeState, FormQueryResult> =
createSelector(selectHomeState, getFormQueryResult);
export const selectHomeFormQueryResultSchema: MemoizedSelector<HomeState, FormQueryResultSchema> =
createSelector(selectHomeState, getFormQueryResultSchema);
export const selectHomeFormQueryResultStats: MemoizedSelector<HomeState, FormQueryResultStats> =
createSelector(selectHomeState, getFormQueryResultStats);
