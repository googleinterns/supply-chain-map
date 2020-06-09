import { SidePanel } from '../side-panel.models';

export interface SidePanelState {
    sidePanelData: SidePanel;
    error: Error;
    isLoading: boolean;
}

export const initialState: SidePanelState = {
    sidePanelData: null,
    error: null,
    isLoading: false
};
