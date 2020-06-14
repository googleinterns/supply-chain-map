import { createAction, props } from '@ngrx/store';
import { Layer } from '../map.models';

export const layerLoadSuccess = createAction(
  '[Map] Load Layer Success',
  props<{ layer: Layer }>()
);

export const layerLoadFailure = createAction(
  '[Map] Load Layer Failure',
  props<{ error: Error }>()
);
