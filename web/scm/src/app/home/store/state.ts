import { FormQueryResult, FormQueryResultStats } from '../home.models';
import { FilterFunction } from '../map/map.models';

export interface HomeState {
    formQuery: string;
    originalFormQueryResult: FormQueryResult;
    formQueryResult: FormQueryResult;
    formQueryResultStats: FormQueryResultStats;
    filters: {
        identifier: string,
        isActive: boolean,
        filter: FilterFunction
    }[];
    sidePanelWidth: number;
    dashboardHeight: number;
    error: Error;
    isLoading: boolean;
}

export const initialState: HomeState = {
    formQuery: null,
    originalFormQueryResult: null,
    formQueryResult: null,
    formQueryResultStats: null,
    filters: [],
    sidePanelWidth: 300,
    dashboardHeight: 200,
    isLoading: false,
    error: null
};
