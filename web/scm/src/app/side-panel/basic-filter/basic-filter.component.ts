import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss', '../form-field.scss']
})
export class BasicFilterComponent implements OnInit {

  basicForm: FormGroup;

  productSelectOptions: any[];

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

  ngOnInit(): void {
    this.initializeOptions();
  }

  private initializeOptions() {
    this.productSelectOptions = [
      { name: 'Google Nest Mini, US, Chalk', gpn: 'GA00638' },
      { name: 'Google Nest Mini, US, White', gpn: 'GA00639' },
      { name: 'Google Pixel 5, US, Just Black', gpn: 'GA00643' },
      { name: 'Google Pixel 5, US, White', gpn: 'GA00756' }
    ];
  }

}
