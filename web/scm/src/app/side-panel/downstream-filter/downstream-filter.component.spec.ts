import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownstreamFilterComponent } from './downstream-filter.component';

describe('DownstreamFilterComponent', () => {
  let component: DownstreamFilterComponent;
  let fixture: ComponentFixture<DownstreamFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownstreamFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownstreamFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
