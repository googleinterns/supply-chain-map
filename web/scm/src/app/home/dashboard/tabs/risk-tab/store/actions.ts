import { createAction, props } from '@ngrx/store';

export const riskQueryFetchSuccess = createAction(
    '[Risk Tab] Risk Query Fetch Success',
    props<{ rows: any[] }>()
);
export const riskQueryFetchFailure = createAction(
    '[Risk Tab] Risk Query Fetch Failure',
    props<{ error: Error }>()
);
