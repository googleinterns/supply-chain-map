import { SidePanel } from '../side-panel.models';

export interface SidePanelState {
    sidePanelData: SidePanel;
    error: Error;
    isLoading: boolean;
}

export const initialState: SidePanelState = {
    sidePanelData: {
        product: {
            products: []
        },
        upstream: {
            categories: [],
            suppliers: [],
            countries: [],
            states: [],
            cities: []
        },
        downstream: {
            countries: [],
            states: [],
            cities: []
        }
    },
    error: null,
    isLoading: false
};
