import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTabComponent } from './map-tab.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { MapState } from 'src/app/home/map/store/state';
import { MatDialogModule } from '@angular/material/dialog';
import { Layer } from 'src/app/home/map/map.models';
import { selectMapLayers } from 'src/app/home/map/store/selectors';

describe('MapTabComponent', () => {
  let component: MapTabComponent;
  let fixture: ComponentFixture<MapTabComponent>;
  let mockStore: MockStore;
  let mockLayerSelector: MemoizedSelector<MapState, Layer[]>;

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
    mockLayerSelector = mockStore.overrideSelector(
      selectMapLayers,
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
