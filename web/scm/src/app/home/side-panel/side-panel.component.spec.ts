import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelComponent } from './side-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BasicFilterComponent } from './filters/basic-filter/basic-filter.component';
import { UpstreamFilterComponent } from './filters/upstream-filter/upstream-filter.component';
import { CmFilterComponent } from './filters/cm-filter/cm-filter.component';
import { DownstreamFilterComponent } from './filters/downstream-filter/downstream-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

describe('SidePanelComponent', () => {
  let component: SidePanelComponent;
  let fixture: ComponentFixture<SidePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidePanelComponent,
        BasicFilterComponent,
        UpstreamFilterComponent,
        CmFilterComponent,
        DownstreamFilterComponent
      ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
