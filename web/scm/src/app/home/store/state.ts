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
    error: Error;
    isLoading: boolean;
}

export const initialState: HomeState = {
    formQuery: null,
    originalFormQueryResult: null,
    formQueryResult: null,
    formQueryResultStats: null,
    filters: [],
    isLoading: false,
    error: null
};
