import { createAction, props } from '@ngrx/store';
import { FormQueryResponse, FormQueryResult } from '../home.models';
import { FilterFunction } from '../map/map.models';

export const formQueryGenerated = createAction(
  '[Home] Form Query Generated',
  props<{ formQuery: string }>()
);

export const formQueryFetchSuccess = createAction(
  '[Home] Fetch Using Form Query Success',
  props<{ formQueryResponse: FormQueryResponse }>()
);

export const formQueryFetchFailure = createAction(
  '[Home] Fetch Using Form Query Failure',
  props<{ error: Error }>()
);

export const invalidServiceAccount = createAction(
  '[Home] User does not have access to GCP project',
  props<{ error: Error }>()
);

export const addFilter = createAction(
  '[Map] Add Filter',
  props<{ filterIdentifier: string, filter: FilterFunction, isActive: boolean }>()
);

export const removeFilter = createAction(
  '[Map] Remove Filter',
  props<{ filterIdentifier: string }>()
);

export const activateFilter = createAction(
  '[Map] Activate Filter',
  props<{ filterIdentifier: string }>()
);

export const deactivateFilter = createAction(
  '[Map] Deactivate Filter',
  props<{ filterIdentifier: string }>()
);
