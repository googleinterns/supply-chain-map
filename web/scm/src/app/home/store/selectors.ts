import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { HomeState } from './state';
import { FormQueryResult } from '../home.models';

const isLoading = (state: HomeState) => state.isLoading;
const getError = (state: HomeState) => state.error;
const getFormQuery = (state: HomeState) => state.formQuery;
const getFormQueryResult = (state: HomeState) => state.formQueryResult;

export const selectHomeState: MemoizedSelector<object, HomeState> = createFeatureSelector<HomeState>('home');

export const selectHomeIsLoading: MemoizedSelector<HomeState, boolean> = createSelector(selectHomeState, isLoading);
export const selectHomeError: MemoizedSelector<HomeState, Error> = createSelector(selectHomeState, getError);
export const selectHomeFormQuery: MemoizedSelector<HomeState, string> =
createSelector(selectHomeState, getFormQuery);
export const selectHomeFormQueryResult: MemoizedSelector<HomeState, FormQueryResult> =
createSelector(selectHomeState, getFormQueryResult);
