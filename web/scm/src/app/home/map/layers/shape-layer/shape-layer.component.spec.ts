import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeLayerComponent } from './shape-layer.component';

describe('ShapeLayerComponent', () => {
  let component: ShapeLayerComponent;
  let fixture: ComponentFixture<ShapeLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
