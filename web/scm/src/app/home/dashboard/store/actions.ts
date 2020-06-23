import { createAction, props } from '@ngrx/store';

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
