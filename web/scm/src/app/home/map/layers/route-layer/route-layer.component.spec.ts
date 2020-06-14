import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouteLayerComponent } from './route-layer.component';
import { MemoizedSelector } from '@ngrx/store';
import { MapState } from '../../store/state';
import { RouteLayerLine, Layer } from '../../map.models';
import { selectMapLayer } from '../../store/selectors';

describe('RouteLayerComponent', () => {
  let component: RouteLayerComponent;
  let fixture: ComponentFixture<RouteLayerComponent>;
  let mockStore: MockStore;
  let mockLayerSelector: MemoizedSelector<MapState, Layer>;

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
    mockLayerSelector = mockStore.overrideSelector(
      selectMapLayer('Route Layer'),
      {
        name: 'Route Layer',
        deletable: true,
        data: {
          routeLayerMarkers: [],
          routeLayerLines: []
        }
      }
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
