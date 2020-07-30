export interface RiskState {
    riskQueryResult: any[];
    isLoading: boolean;
    error: Error;
}

export const initialState: RiskState = {
    riskQueryResult: [],
    isLoading: false,
    error: null
};
