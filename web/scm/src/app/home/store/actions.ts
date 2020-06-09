import { createAction, props } from '@ngrx/store';
import { FormQueryResult } from '../home.models';

export const formQueryGenerated = createAction(
  '[Home] Form Query Generated',
  props<{ formQuery: string }>()
);

export const formQueryFetchSuccess = createAction(
  '[Home] Fetch Using Form Query Success',
  props<{ formQueryResult: FormQueryResult }>()
);

export const formQueryFetchFailure = createAction(
  '[Home] Fetch Using Form Query Failure',
  props<{ error: Error }>()
);
