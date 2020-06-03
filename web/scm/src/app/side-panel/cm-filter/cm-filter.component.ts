import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-cm-filter',
  templateUrl: './cm-filter.component.html',
  styleUrls: ['./cm-filter.component.scss', '../form-field.scss']
})
export class CmFilterComponent implements OnInit {

  cmForm: FormGroup;

  countrySelectOptions: any[];
  regionSelectOptions: any[];
  citySelectOptions: any[];

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
    this.countrySelectOptions = [
      { name: 'United States of America', code: 'USA' },
      { name: 'Canada', code: 'CA' },
      { name: 'China', code: 'CHN' },
      { name: 'India', code: 'IND' }
    ];
    this.regionSelectOptions = [
      { name: 'New York', code: 'NY' },
      { name: 'California', code: 'CA' },
      { name: 'Ontario', code: 'OTR' },
      { name: 'Sichuan', code: 'SCN' },
      { name: 'Hubei', code: 'HBI' }
    ];
    this.citySelectOptions = [
      { name: 'Wuhan', code: 'WHN' },
      { name: 'Yichang', code: 'YCG' },
      { name: 'Rochester', code: 'ROC' },
      { name: 'Sunnyvale', code: 'SVL' },
      { name: 'Bombay', code: 'BOM' },
      { name: 'Toronto', code: 'TOR' }
    ];
  }

}
