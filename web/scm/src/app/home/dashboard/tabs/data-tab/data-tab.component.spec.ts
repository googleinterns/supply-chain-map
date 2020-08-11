import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTabComponent } from './data-tab.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { HomeState } from 'src/app/home/store/state';
import { FormQueryResult } from 'src/app/home/home.models';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { DashboardState } from '../../store/state';
import { selectDashboardData } from '../../store/selectors';

describe('DataTabComponent', () => {
  let component: DataTabComponent;
  let fixture: ComponentFixture<DataTabComponent>;
  let mockStore: MockStore;
  let mockFormResultSelector: MemoizedSelector<HomeState, FormQueryResult>;
  let mockDashboardResultSelector: MemoizedSelector<DashboardState, FormQueryResult>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTabComponent ],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockFormResultSelector = mockStore.overrideSelector(
      selectHomeFormQueryResult,
      {
        upstream: [],
        cm: [],
        downstream: []
      }
    );
    mockDashboardResultSelector = mockStore.overrideSelector(
      selectDashboardData,
      {
        upstream: [],
        cm: [],
        downstream: []
      }
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
