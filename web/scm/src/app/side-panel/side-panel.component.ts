import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BasicFilterComponent } from './basic-filter/basic-filter.component';
import { UpstreamFilterComponent } from './upstream-filter/upstream-filter.component';
import { DownstreamFilterComponent } from './downstream-filter/downstream-filter.component';
import { CmFilterComponent } from './cm-filter/cm-filter.component';
import { FilterFormService } from '../services/filter-form/filter-form.service';

@Component({
  selector: 'scm-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, AfterViewInit {

  @ViewChild(BasicFilterComponent) basicFilterComponent: BasicFilterComponent;
  @ViewChild(UpstreamFilterComponent) upstreamFilterComponent: UpstreamFilterComponent;
  @ViewChild(DownstreamFilterComponent) downstreamFilterComponent: DownstreamFilterComponent;
  @ViewChild(CmFilterComponent) cmFilterComponent: CmFilterComponent;

  sidePanelFormGroup: FormGroup;

  loading = true;

  constructor(private filterFormService: FilterFormService) {
    this.sidePanelFormGroup = new FormGroup({});
  }

  private fetchFormData() {
    this.filterFormService
    .getFilterData()
      .then(
        filterData => {
          this.basicFilterComponent.productSelectOptions = filterData.products;

          this.upstreamFilterComponent.categorySelectOptions = filterData.upstream_categories;
          this.upstreamFilterComponent.supplierSelectOptions = filterData.upstream_suppliers;

          this.upstreamFilterComponent.countrySelectOptions = filterData.upstream_countries;
          this.upstreamFilterComponent.regionSelectOptions = filterData.upstream_states;
          this.upstreamFilterComponent.citySelectOptions = filterData.upstream_cities;

          this.cmFilterComponent.countrySelectOptions = filterData.cm_countries;
          this.cmFilterComponent.regionSelectOptions = filterData.cm_states;
          this.cmFilterComponent.citySelectOptions = filterData.cm_cities;

          this.downstreamFilterComponent.countrySelectOptions = filterData.downstream_countries;
          this.downstreamFilterComponent.regionSelectOptions = filterData.downstream_states;
          this.downstreamFilterComponent.citySelectOptions = filterData.downstream_cities;

          this.loading = false;
        }
      );
  }

  ngAfterViewInit(): void {
    this.sidePanelFormGroup = new FormGroup({
      basicFilterGroup: this.basicFilterComponent.basicForm,
      upstreamFilterGroup: this.upstreamFilterComponent.upstreamForm,
      cmFilterGroup: this.cmFilterComponent.cmForm,
      downstreamFilterGroup: this.downstreamFilterComponent.downstreamForm
    });
    this.fetchFormData();
  }

  ngOnInit(): void {
  }

  sidePanelFormSubmit() {
    this.filterFormService.submitForm(this.sidePanelFormGroup);
  }

}
