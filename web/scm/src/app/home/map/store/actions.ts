import { createAction, props } from '@ngrx/store';
import { AdditionalLayer, RouteLayer } from '../map.models';

export const loadRouteLayer = createAction(
  '[Map] Load Route Layer',
  props<{ layer: RouteLayer }>()
);

export const routeLayerLoadSuccess = createAction(
  '[Map] Load Route Layer Success',
  props<{ layer: RouteLayer }>()
);

export const routeLayerLoadFailure = createAction(
  '[Map] Load Route Layer Failure',
  props<{ error: Error }>()
);

export const loadAdditionalLayer = createAction(
  '[Map] Load Additional Layer',
  props<{ layerName: string }>()
);

export const additionalLayerLoadSuccess = createAction(
  '[Map] Load Additional Layer Success',
  props<{ layer: AdditionalLayer }>()
);

export const additionalLayerLoadFailure = createAction(
  '[Map] Load Additional Layer Failure',
  props<{ error: Error }>()
);
