import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Downstream } from '../../side-panel.models';

@Component({
  selector: 'scm-downstream-filter',
  templateUrl: './downstream-filter.component.html',
  styleUrls: ['./downstream-filter.component.scss', '../../form-field.scss']
})
export class DownstreamFilterComponent {

  downstreamForm: FormGroup;

  @Input() downstreamData: Downstream;

  constructor() {
    this.downstreamForm = new FormGroup({
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
