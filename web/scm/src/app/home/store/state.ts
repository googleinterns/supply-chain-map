import { FormQueryResult } from '../home.models';

export interface HomeState {
    formQuery: string;
    formQueryResult: FormQueryResult;
    error: Error;
    isLoading: boolean;
}

export const initialState: HomeState = {
    formQuery: null,
    formQueryResult: null,
    isLoading: false,
    error: null
};
