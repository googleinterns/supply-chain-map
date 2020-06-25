import { createAction, props } from '@ngrx/store';
import { FormQueryResponse, FormQueryResult } from '../home.models';

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

export const skuFilterFormQueryResult = createAction(
  '[Home] Filter Form Query Result with SKUs',
  props<{ sku: Set<string> }>()
);

export const skuFilterFormQueryResultSuccess = createAction(
  '[Home] Filter Form Query Result with SKUs Success',
  props<{ formQueryResponse: { formQueryResult: FormQueryResult } }>()
);
