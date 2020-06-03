import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BasicFilterComponent } from './basic-filter/basic-filter.component';
import { UpstreamFilterComponent } from './upstream-filter/upstream-filter.component';
import { DownstreamFilterComponent } from './downstream-filter/downstream-filter.component';
import { CmFilterComponent } from './cm-filter/cm-filter.component';

@Component({
  selector: 'scm-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit, AfterViewInit {

  @ViewChild(BasicFilterComponent) basicFilterComponent: BasicFilterComponent;
  @ViewChild(UpstreamFilterComponent) upstreamFilterComponent: UpstreamFilterComponent;
  @ViewChild(DownstreamFilterComponent) downstreamFilterComponent: DownstreamFilterComponent;
  @ViewChild(CmFilterComponent) cmFilterComponent: CmFilterComponent;

  sidePanelFormGroup: FormGroup;

  constructor() {
    this.sidePanelFormGroup = new FormGroup({});
  }

  ngAfterViewInit(): void {
    this.sidePanelFormGroup = new FormGroup({
      basicFilterGroup: this.basicFilterComponent.basicForm,
      upstreamFilterGroup: this.upstreamFilterComponent.upstreamForm,
      cmFilterGroup: this.cmFilterComponent.cmForm,
      downstreamFilterGroup: this.downstreamFilterComponent.downstreamForm
    });
  }

  ngOnInit(): void {
  }

  sidePanelFormSubmit() {
    console.log(this.sidePanelFormGroup);
  }

}
