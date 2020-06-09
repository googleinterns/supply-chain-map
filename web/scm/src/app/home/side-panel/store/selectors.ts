import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';
import { SidePanelState } from './state';
import { SidePanel, Basic, Upstream, Cm, Downstream } from '../side-panel.models';

const isLoading = (state: SidePanelState) => state.isLoading;
const getError = (state: SidePanelState) => state.error;
const getSidePanel = (state: SidePanelState) => state.sidePanelData;

export const selectSidePanelState: MemoizedSelector<object, SidePanelState> = createFeatureSelector<SidePanelState>('sidePanel');

export const selectSidePanelIsLoading: MemoizedSelector<SidePanelState, boolean> = createSelector(selectSidePanelState, isLoading);
export const selectSidePanelError: MemoizedSelector<SidePanelState, Error> = createSelector(selectSidePanelState, getError);
export const selectSidePanelData: MemoizedSelector<SidePanelState, SidePanel> = createSelector(selectSidePanelState, getSidePanel);
