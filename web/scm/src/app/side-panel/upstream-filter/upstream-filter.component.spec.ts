import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpstreamFilterComponent } from './upstream-filter.component';

describe('UpstreamFilterComponent', () => {
  let component: UpstreamFilterComponent;
  let fixture: ComponentFixture<UpstreamFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpstreamFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpstreamFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
