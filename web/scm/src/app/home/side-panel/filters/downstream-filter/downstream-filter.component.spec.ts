import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownstreamFilterComponent } from './downstream-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

describe('DownstreamFilterComponent', () => {
  let component: DownstreamFilterComponent;
  let fixture: ComponentFixture<DownstreamFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DownstreamFilterComponent],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
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
    fixture = TestBed.createComponent(DownstreamFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
