import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Basic } from '../../side-panel.models';

@Component({
  selector: 'scm-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss', '../../form-field.scss']
})
export class BasicFilterComponent {

  basicForm: FormGroup;

  @Input() basicData: Basic;

  constructor() {
    this.basicForm = new FormGroup({
      productFilterGroup: new FormGroup({
        productSelect: new FormControl()
      }),
      mapPropFilterGroup: new FormGroup({
        uniqueCheckbox: new FormControl(),
        drawPathCheckbox: new FormControl(),
        singleSrcCheckbox: new FormControl(),
      })
    });
  }

}
