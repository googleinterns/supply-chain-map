import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
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
   * These are the slices of states that we are
   * observing.
   */
  isLoading$: Observable<boolean>;
  error$: Observable<Error>;
  sidePanelData$: Observable<SidePanel>;

  shouldIncludeUpstream: boolean;
  shouldIncludeDownstream: boolean;
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

    this.sidePanelFormGroup = new FormGroup({
      productFilterGroup: new FormGroup({
        productSelect: new FormControl()
      }),
      upstreamFilterGroup: new FormGroup({
        componentFilterGroup: new FormGroup({
          categorySelect: new FormControl(),
          supplierSelect: new FormControl()
        }),
        locationFilterGroup: new FormGroup({
          countrySelect: new FormControl(),
          regionSelect: new FormControl(),
          citySelect: new FormControl(),
        }),
        additionalFilterGroup: new FormGroup({
          minLeadTimeInput: new FormControl(),
          maxLeadTimeInput: new FormControl()
        })
      }),
      downstreamFilterGroup: new FormGroup({
        locationFilterGroup: new FormGroup({
          countrySelect: new FormControl(),
          regionSelect: new FormControl(),
          citySelect: new FormControl(),
        }),
        additionalFilterGroup: new FormGroup({
          minLeadTimeInput: new FormControl(),
          maxLeadTimeInput: new FormControl()
        })
      })
    });
  }
  /**
   * After the form is submitted, convert the selection to
   * a SQL using the helper service and dispatch
   * appropriate action with the generated SQL.
   */
  sidePanelFormSubmit() {
    const filterGroup = this.sidePanelFormGroup.value;
    if (!this.shouldIncludeUpstream) {
      delete filterGroup.upstreamFilterGroup;
    }
    if (!this.shouldIncludeDownstream) {
      delete filterGroup.downstreamFilterGroup;
    }
    const generatedSQL = this.filterFormService.convertFormToQuery(filterGroup);
    this.store.dispatch(formQueryGenerated({ formQuery: generatedSQL }));
  }

  changeSupplyChainNodesRadio($event) {
    if ($event.value === 'UPSTREAM') {
      this.shouldIncludeUpstream = true;
      this.shouldIncludeDownstream = false;
    } else if ($event.value === 'DOWNSTREAM') {
      this.shouldIncludeUpstream = false;
      this.shouldIncludeDownstream = true;
    } else {
      this.shouldIncludeUpstream = true;
      this.shouldIncludeDownstream = true;
    }
  }

}
