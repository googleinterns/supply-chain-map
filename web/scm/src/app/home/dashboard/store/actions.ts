import { createAction, props } from '@ngrx/store';
import { FormQueryResponse } from '../../home.models';

export const getAdditionalMapLayerNames = createAction(
  '[Dashboard] Get Additional Map Layer Names'
);

export const getAdditionalMapLayerNamesSuccess = createAction(
  '[Dashboard] Get Additional Map Layer Names Success',
  props<{ heatmapLayers: string[], shapeLayers: string[] }>()
);

export const getAdditionalMapLayerNamesFailure = createAction(
  '[Dashboard] Get Additional Map Layer Names Failure',
  props<{ error: Error }>()
);

export const fetchDashboardResult = createAction(
    '[Dashboard] Fetch Dashboard Result'
);

export const dashboardFetchSuccess = createAction(
    '[Dashboard] Dashboard Fetch Success',
    props<{ dashboardResponse: FormQueryResponse }>()
);

export const dashboardFetchFailure = createAction(
    '[Dashboard] Dashboard Fetch Failure',
    props<{ error: Error }>()
);
