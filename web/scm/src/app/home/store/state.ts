import { FormQueryResult, FormQueryResultSchema, FormQueryResultStats } from '../home.models';

export interface HomeState {
    formQuery: string;
    originalFormQueryResult: FormQueryResult;
    formQueryResult: FormQueryResult;
    formQueryResultSchema: FormQueryResultSchema;
    formQueryResultStats: FormQueryResultStats;
    error: Error;
    isLoading: boolean;
}

export const initialState: HomeState = {
    formQuery: null,
    originalFormQueryResult: null,
    formQueryResult: null,
    formQueryResultSchema: null,
    formQueryResultStats: null,
    isLoading: false,
    error: null
};
