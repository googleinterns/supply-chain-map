import { createAction, props } from '@ngrx/store';
import { Layer, RouteLayerMarker, FilterFunction } from '../map.models';

export const loadLayer = createAction(
  '[Map] Load Layer',
  props<{ layer: Layer }>()
);

export const layerLoadSuccess = createAction(
  '[Map] Load Layer Success',
  props<{ layer: Layer }>()
);

export const layerLoadFailure = createAction(
  '[Map] Load Layer Failure',
  props<{ error: Error }>()
);

export const layerRemove = createAction(
  '[Map] Remove Layer',
  props<{ layer: Layer }>()
);
