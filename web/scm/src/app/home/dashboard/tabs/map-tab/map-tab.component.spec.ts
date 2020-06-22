import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTabComponent } from './map-tab.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { HomeState } from 'src/app/home/store/state';
import { FormQueryResult } from 'src/app/home/home.models';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { MapState } from 'src/app/home/map/store/state';
import { RouteLayer, AdditionalLayer } from 'src/app/home/map/map.models';
import { selectMapRouteLayer, selectMapAdditionalLayers } from 'src/app/home/map/store/selectors';
import { MatDialogModule } from '@angular/material/dialog';

describe('MapTabComponent', () => {
  let component: MapTabComponent;
  let fixture: ComponentFixture<MapTabComponent>;
  let mockStore: MockStore;
  let mockRouteLayerSelector: MemoizedSelector<MapState, RouteLayer>;
  let mockAdditionalLayersSelector: MemoizedSelector<MapState, AdditionalLayer[]>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ MapTabComponent ],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockRouteLayerSelector = mockStore.overrideSelector(
      selectMapRouteLayer,
      {
        name: 'Route Layer',
        markers:  [],
        lines: []
      }
    );
    mockAdditionalLayersSelector = mockStore.overrideSelector(
      selectMapAdditionalLayers,
      []
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
