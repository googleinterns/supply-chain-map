import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { RiskState } from './state';

const getRiskQueryResult = (state: RiskState) => state.riskQueryResult;
const getIsLoading = (state: RiskState) => state.isLoading;
const getError = (state: RiskState) => state.error;

export const selectRiskState: MemoizedSelector<object, RiskState> = createFeatureSelector<RiskState>('risk');

export const selectRiskQueryResult: MemoizedSelector<RiskState, any[]> = createSelector(selectRiskState, getRiskQueryResult);
export const selectRiskIsLoading: MemoizedSelector<RiskState, boolean> = createSelector(selectRiskState, getIsLoading);
export const selectRiskError: MemoizedSelector<RiskState, Error> = createSelector(selectRiskState, getError);
