import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteLayerComponent } from './route-layer.component';

describe('RouteLayerComponent', () => {
  let component: RouteLayerComponent;
  let fixture: ComponentFixture<RouteLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
