import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmFilterComponent } from './cm-filter.component';

describe('CmFilterComponent', () => {
  let component: CmFilterComponent;
  let fixture: ComponentFixture<CmFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
