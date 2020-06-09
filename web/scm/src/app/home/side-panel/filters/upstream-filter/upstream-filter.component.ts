import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Upstream } from '../../side-panel.models';

@Component({
  selector: 'scm-upstream-filter',
  templateUrl: './upstream-filter.component.html',
  styleUrls: ['./upstream-filter.component.scss', '../../form-field.scss']
})
export class UpstreamFilterComponent {

  upstreamForm: FormGroup;

  @Input() upstreamData: Upstream;

  constructor() {
    this.upstreamForm = new FormGroup({
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
    });
 }

}
