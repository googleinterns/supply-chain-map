import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { DashboardComponent } from './dashboard.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HomeState } from '../store/state';
import { FormQueryResult } from '../home.models';
import { MemoizedSelector } from '@ngrx/store';
import { selectHomeFormQueryResult } from '../store/selectors';
import { MapTabComponent } from './tabs/map-tab/map-tab.component';
import { DataTabComponent } from './tabs/data-tab/data-tab.component';
import { StatsTabComponent } from './tabs/stats-tab/stats-tab.component';
import { SelectLayerComponent } from './tabs/map-tab/select-layer-dialog/select-layer.dialog';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockStore: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MapTabComponent,
        DataTabComponent,
        StatsTabComponent,
        SelectLayerComponent
      ],
      imports: [
        CommonModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTabsModule,
        BrowserAnimationsModule,
        BrowserModule,
        RouterTestingModule
      ],
      providers: [
        provideMockStore()
      ]
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockStore.setState({
      home: {
        formQuery: null,
        formQueryResult: null,
        formQueryResultSchema: null,
        formQueryResultStats: null,
        isLoading: false,
        error: null
      },
      map: {
        additionalLayers: [
        ],
        error: null,
        isLoading: false
      },
      dashboard: {
        additionalLayerNames: [],
        error: null
      }
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create the dashboard component', () => {
    expect(component).toBeTruthy();
  });
});
