import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFilterComponent } from './basic-filter.component';

describe('BasicFilterComponent', () => {
  let component: BasicFilterComponent;
  let fixture: ComponentFixture<BasicFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
