import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'scm-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit {

  basicForm: FormGroup;

  productSelectOptions: any[];
  categorySelectOptions: any[];
  supplierSelectOptions: any[];

  countrySelectOptions: any[];
  regionSelectOptions: any[];
  citySelectOptions: any[];

  constructor() {
    this.basicForm = new FormGroup({
      productFilterGroup: new FormGroup({
        productSelect: new FormControl(),
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

  initializeOptions() {
    this.productSelectOptions = [
      { name: 'Google Nest Mini, US, Chalk', gpn: 'GA00638' },
      { name: 'Google Nest Mini, US, White', gpn: 'GA00639' },
      { name: 'Google Pixel 5, US, Just Black', gpn: 'GA00643' },
      { name: 'Google Pixel 5, US, White', gpn: 'GA00756' }
    ];
    this.categorySelectOptions = [
      { name: 'IC', code: 'IC' },
      { name: 'LED', code: 'LED' },
      { name: 'Printed Material', code: 'PM' },
      { name: 'Plastic', code: 'MANU' }
    ];
    this.supplierSelectOptions = [
      { name: 'RR Donnelley', code: 'RRD' },
      { name: 'Greendoer', code: 'GDR' },
      { name: 'Paishing', code: 'PSG' },
      { name: 'Avary', code: 'AVR' }
    ];

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

  /**
   * This function is called when the form is submitted
   */
  onBasicFormSubmit() {
    console.log(this.basicForm.value);
  }

}
