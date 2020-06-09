import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouteLayerComponent } from './route-layer.component';
import { MemoizedSelector } from '@ngrx/store';
import { MapState } from '../../store/state';
import { RouteLayerMarker, RouteLayerLine } from '../../map.models';
import { selectMapRouteLayerMarkers, selectMapRouteLayerLines } from '../../store/selectors';

describe('RouteLayerComponent', () => {
  let component: RouteLayerComponent;
  let fixture: ComponentFixture<RouteLayerComponent>;
  let mockStore: MockStore;
  let mockRouteLayerMarkersSelector: MemoizedSelector<MapState, RouteLayerMarker[]>;
  let mockRouteLayerLinesSelector: MemoizedSelector<MapState, RouteLayerLine[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteLayerComponent ],
      imports: [],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockRouteLayerMarkersSelector = mockStore.overrideSelector(
      selectMapRouteLayerMarkers,
      []
    );
    mockRouteLayerLinesSelector = mockStore.overrideSelector(
      selectMapRouteLayerLines,
      []
    );
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
