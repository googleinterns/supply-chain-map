import { createReducer, on, Action } from '@ngrx/store';
import { HomeState, initialState } from './state';
import * as HomeActions from './actions';
import { FilterFunction } from '../map/map.models';
import { FormQueryResult } from '../home.models';

const homeReducer = createReducer(
    initialState,
    on(HomeActions.formQueryGenerated, (state, { formQuery }) => ({
        ...state,
        formQuery: formQuery,
        isLoading: true
    })),
    on(HomeActions.formQueryFetchSuccess, (state, { formQueryResponse }) => ({
        ...state,
        originalFormQueryResult: formQueryResponse.formQueryResult,
        formQueryResult: filterFormQueryResult(state.filters, formQueryResponse.formQueryResult),
        formQueryResultStats: formQueryResponse.formQueryResultStats,
        isLoading: false
    })),
    on(HomeActions.formQueryFetchFailure, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    })),
    on(HomeActions.invalidServiceAccount, (state, { error }) => ({
        ...state,
        error: error,
        isLoading: false
    })),
    on(HomeActions.addFilter, (state, { filterIdentifier, filter }) => {
        const filters = addFilterToObject(filterIdentifier, filter, state.filters);
        return {
            ...state,
            filters: filters,
            formQueryResult: filterFormQueryResult(filters, state.originalFormQueryResult)
        };
    }),
    on(HomeActions.removeFilter, (state, { filterIdentifier }) => {
        const filters = state.filters.filter(f => f.identifier !== filterIdentifier);
        return {
            ...state,
            filters: filters,
            formQueryResult: filterFormQueryResult(filters, state.originalFormQueryResult)
        };
    }),
    on(HomeActions.activateFilter, (state, { filterIdentifier }) => {
        const filters = setFilterActiveStatus(filterIdentifier, true, state.filters);
        return {
            ...state,
            filters: filters,
            formQueryResult: filterFormQueryResult(filters, state.originalFormQueryResult)
        };
    }),
    on(HomeActions.deactivateFilter, (state, { filterIdentifier }) => {
        const filters = setFilterActiveStatus(filterIdentifier, false, state.filters);
        return {
            ...state,
            filters: filters,
            formQueryResult: filterFormQueryResult(filters, state.originalFormQueryResult)
        };
    }),
);

function setFilterActiveStatus(
    filterIdentifier: string,
    status: boolean,
    filters: { identifier: string, isActive: boolean, filter: FilterFunction }[])
    : { identifier: string, isActive: boolean, filter: FilterFunction }[] {
    const updatedFilters = [];
    for (const filter of filters) {
        const updatedFilter = Object.assign({}, filter);
        if (filter.identifier === filterIdentifier) {
            updatedFilter.isActive = status;
        }
        updatedFilters.push(updatedFilter);
    }
    return updatedFilters;
}

function addFilterToObject(
    filterIdentifier: string,
    filter: FilterFunction,
    filters: { identifier: string, isActive: boolean, filter: FilterFunction }[])
    : { identifier: string, isActive: boolean, filter: FilterFunction }[] {
    filters = filters.filter(f => f.identifier !== filterIdentifier);
    filters.push({
        identifier: filterIdentifier,
        isActive: false,
        filter: filter
    });
    return filters;
}

function filterFormQueryResult(
    filters: { identifier: string, isActive: boolean, filter: FilterFunction }[],
    originalFormQueryResult: FormQueryResult): FormQueryResult {
    if (!originalFormQueryResult) {
        return null;
    }
    for (const filter of filters) {
        if (filter.isActive) {
            originalFormQueryResult = filter.filter(originalFormQueryResult);
        }
    }
    return originalFormQueryResult;
}

export function reducer(state: HomeState | undefined, action: Action) {
    return homeReducer(state, action);
}
