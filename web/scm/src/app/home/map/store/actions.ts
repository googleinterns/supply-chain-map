import { createAction, props } from '@ngrx/store';
import { RouteLayerMarker, RouteLayerLine } from '../map.models';

export const routeLayerLoadSuccess = createAction(
  '[Map] Load Route Layer Success',
  props<{ markers: RouteLayerMarker[], lines: RouteLayerLine[] }>()
);

export const routeLayerLoadFailure = createAction(
  '[Map] Load Route Layer Failure',
  props<{ error: Error }>()
);
