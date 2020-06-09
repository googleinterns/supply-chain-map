import { createReducer, on, Action } from '@ngrx/store';
import { SidePanelState, initialState } from './state';
import * as SidepanelActions from './actions';

const sidePanelReducer = createReducer(
    initialState,
    on(SidepanelActions.sidePanelInitDataRequest, (state) => ({
        ...state,
        isLoading: true
    })),
    on(SidepanelActions.sidePanelInitDataSuccess, (state, { sidePanel }) => ({
        ...state,
        sidePanelData: sidePanel,
        isLoading: false
    })),
    on(SidepanelActions.sidePanelInitDataFailure, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    })),
);

export function reducer(state: SidePanelState | undefined, action: Action) {
    return sidePanelReducer(state, action);
}
