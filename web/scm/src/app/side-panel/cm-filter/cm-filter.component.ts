import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-cm-filter',
  templateUrl: './cm-filter.component.html',
  styleUrls: ['./cm-filter.component.scss', '../form-field.scss']
})
export class CmFilterComponent implements OnInit {

  cmForm: FormGroup;

  countrySelectOptions: string[];
  regionSelectOptions: string[];
  citySelectOptions: string[];

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

  ngOnInit(): void {
    this.initializeOptions();
  }


  initializeOptions() {
    this.countrySelectOptions = [ ];
    this.regionSelectOptions = [ ];
    this.citySelectOptions = [ ];
  }

}
