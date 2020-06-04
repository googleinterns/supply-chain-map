import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-upstream-filter',
  templateUrl: './upstream-filter.component.html',
  styleUrls: ['./upstream-filter.component.scss', '../form-field.scss']
})
export class UpstreamFilterComponent implements OnInit {

  upstreamForm: FormGroup;

  categorySelectOptions: string[];
  supplierSelectOptions: string[];

  countrySelectOptions: string[];
  regionSelectOptions: string[];
  citySelectOptions: string[];

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

  ngOnInit(): void {
    this.initializeOptions();
  }


  initializeOptions() {
    this.countrySelectOptions = [ ];
    this.regionSelectOptions = [ ];
    this.citySelectOptions = [ ];
    this.categorySelectOptions = [ ];
    this.supplierSelectOptions = [ ];
  }

}
