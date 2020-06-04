import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-downstream-filter',
  templateUrl: './downstream-filter.component.html',
  styleUrls: ['./downstream-filter.component.scss', '../form-field.scss']
})
export class DownstreamFilterComponent implements OnInit {

  downstreamForm: FormGroup;

  countrySelectOptions: string[];
  regionSelectOptions: string[];
  citySelectOptions: string[];

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

  ngOnInit(): void {
    this.initializeOptions();
  }


  initializeOptions() {
    this.countrySelectOptions = [ ];
    this.regionSelectOptions = [ ];
    this.citySelectOptions = [ ];
  }
}
