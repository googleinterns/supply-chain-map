import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BasicFilterComponent } from './filters/basic-filter/basic-filter.component';
import { UpstreamFilterComponent } from './filters/upstream-filter/upstream-filter.component';
import { DownstreamFilterComponent } from './filters/downstream-filter/downstream-filter.component';
import { CmFilterComponent } from './filters/cm-filter/cm-filter.component';
import { SidePanelState } from './store/state';
import { selectSidePanelData, selectSidePanelIsLoading, selectSidePanelError } from './store/selectors';
import { FilterFormService } from './services/filter-form.service';
import { Observable } from 'rxjs';
import { SidePanel } from './side-panel.models';
import { sidePanelInitDataRequest } from './store/actions';
import { formQueryGenerated } from '../store/actions';

@Component({
  selector: 'scm-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent {

  /**
   * The form in the SidePanelComponent
   */
  sidePanelFormGroup: FormGroup;
  /**
   * These are the children form groups that the side panel
   * form (@var sidePanelFormGroup) contains.
   */
  @ViewChild(BasicFilterComponent) basicFilterComponent: BasicFilterComponent;
  @ViewChild(UpstreamFilterComponent) upstreamFilterComponent: UpstreamFilterComponent;
  @ViewChild(DownstreamFilterComponent) downstreamFilterComponent: DownstreamFilterComponent;
  @ViewChild(CmFilterComponent) cmFilterComponent: CmFilterComponent;
  @ViewChild('sidePanelForm') set content(content: ElementRef) {
    /**
     * Once the form is initialized, we have access
     * to the children form group.
     */
    if (content) {
      this.sidePanelFormGroup = new FormGroup({
        basicFilterGroup: this.basicFilterComponent.basicForm,
        upstreamFilterGroup: this.upstreamFilterComponent.upstreamForm,
        cmFilterGroup: this.cmFilterComponent.cmForm,
        downstreamFilterGroup: this.downstreamFilterComponent.downstreamForm
      });
    }
  }
  /**
   * These are the slices of states that we are
   * observing.
   */
  isLoading$: Observable<boolean>;
  error$: Observable<Error>;
  sidePanelData$: Observable<SidePanel>;
  /**
   * Initializing the @var sidePanelFormGroup with an empty
   * form group, until the view is initialized.
   * @param filterFormService Contains helper methods for this component
   * @param store The ngrx store for SidePanel module
   */
  constructor(private filterFormService: FilterFormService, private store: Store<SidePanelState>) {
    this.sidePanelFormGroup = new FormGroup({});

    this.isLoading$ = this.store.select(selectSidePanelIsLoading);
    this.error$ = this.store.select(selectSidePanelError);
    this.sidePanelData$ = this.store.select(selectSidePanelData);

    this.store.dispatch(sidePanelInitDataRequest());
  }
  /**
   * After the form is submitted, convert the selection to
   * a SQL using the helper service and dispatch
   * appropriate action with the generated SQL.
   */
  sidePanelFormSubmit() {
    const generatedSQL = this.filterFormService.convertFormToQuery(this.sidePanelFormGroup.value);
    this.store.dispatch(formQueryGenerated({ formQuery: generatedSQL }));
  }

}
