import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Cm } from '../../side-panel.models';

@Component({
  selector: 'scm-cm-filter',
  templateUrl: './cm-filter.component.html',
  styleUrls: ['./cm-filter.component.scss', '../../form-field.scss']
})
export class CmFilterComponent {

  cmForm: FormGroup;

  @Input() cmData: Cm;

  constructor() {
    this.cmForm = new FormGroup({
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
