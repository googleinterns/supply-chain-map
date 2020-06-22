import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsTabComponent } from './stats-tab.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { HomeState } from 'src/app/home/store/state';
import { selectHomeFormQueryResult, selectHomeFormQuery, selectHomeFormQueryResultStats } from 'src/app/home/store/selectors';
import { FormQueryResultStats } from 'src/app/home/home.models';

describe('StatsTabComponent', () => {
  let component: StatsTabComponent;
  let fixture: ComponentFixture<StatsTabComponent>;
  let mockStore: MockStore;
  let mockFormQuerySelector: MemoizedSelector<HomeState, string>;
  let mockFormQueryStatsSelector: MemoizedSelector<HomeState, FormQueryResultStats>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsTabComponent ],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockFormQuerySelector = mockStore.overrideSelector(
      selectHomeFormQuery,
      ''
    );
    mockFormQueryStatsSelector = mockStore.overrideSelector(
      selectHomeFormQueryResultStats,
      {
        jobId: '',
        jobComplete: true,
        projectId: '',
        cacheHit: true,
        totalBytesProcessed: '0'
      }
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
