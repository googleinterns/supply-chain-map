import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeLayerComponent } from './shape-layer.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('ShapeLayerComponent', () => {
  let component: ShapeLayerComponent;
  let fixture: ComponentFixture<ShapeLayerComponent>;
  let mockStore: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeLayerComponent ],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
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
