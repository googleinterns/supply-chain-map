import { FormQueryResult, FormQueryResultStats } from '../home.models';

export interface HomeState {
    formQuery: string;
    originalFormQueryResult: FormQueryResult;
    formQueryResult: FormQueryResult;
    formQueryResultStats: FormQueryResultStats;
    error: Error;
    isLoading: boolean;
}

export const initialState: HomeState = {
    formQuery: null,
    originalFormQueryResult: null,
    formQueryResult: null,
    formQueryResultStats: null,
    isLoading: false,
    error: null
};
