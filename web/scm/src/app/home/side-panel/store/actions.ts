import { createAction, props } from '@ngrx/store';
import { SidePanel } from '../side-panel.models';

export const sidePanelInitDataRequest = createAction(
  '[Side Panel] Load Initial Data'
);

export const sidePanelInitDataSuccess = createAction(
  '[Side Panel] Initial Data Load Successful',
  props<{ sidePanel: SidePanel }>()
);

export const sidePanelInitDataFailure = createAction(
  '[Side Panel] Initial Data Load Failure',
  props<{ error: Error }>()
);
