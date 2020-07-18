import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore, MockSelector } from '@ngrx/store/testing';
import { selectMapLayers, selectMapError, selectMapIsLoading } from './store/selectors';
import { MemoizedSelector } from '@ngrx/store';
import { MapState } from './store/state';
import { Layer } from './map.models';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockStore: MockStore;
  let mockSelectLayers: MemoizedSelector<MapState, Layer[]>;
  let mockError: MemoizedSelector<MapState, Error>;
  let mockIsLoading: MemoizedSelector<MapState, boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: environment.googleMapApi
        }),
        BrowserAnimationsModule,
        BrowserModule,
        RouterTestingModule
      ],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockSelectLayers = mockStore.overrideSelector(
      selectMapLayers,
      []
    );
    mockError = mockStore.overrideSelector(
      selectMapError,
      null
    );
    mockIsLoading = mockStore.overrideSelector(
      selectMapIsLoading,
      false
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
