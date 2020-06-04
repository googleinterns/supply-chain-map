import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss', '../form-field.scss']
})
export class BasicFilterComponent implements OnInit {

  basicForm: FormGroup;

  productSelectOptions: string[];

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
    this.productSelectOptions = [ ];
  }

}
