import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTabComponent } from './graph-tab.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { FormQueryResult } from 'src/app/home/home.models';
import { HomeState } from 'src/app/home/store/state';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { selectDashboardData } from '../../store/selectors';
import { DashboardState } from '../../store/state';

describe('GraphTabComponent', () => {
  let component: GraphTabComponent;
  let fixture: ComponentFixture<GraphTabComponent>;
  let mockStore: MockStore;
  let mockFormQuerySelector: MemoizedSelector<DashboardState, FormQueryResult>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        BrowserAnimationsModule
      ],
      declarations: [GraphTabComponent],
      providers: [
        provideMockStore()
      ]
    })
      .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockFormQuerySelector = mockStore.overrideSelector(
      selectDashboardData,
      {
        upstream: [],
        cm: [],
        downstream: []
      }
    );
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create/remove chart', () => {
    const formValue = {
      analyzeTableSelect: 'upstream',
      groupBySelect: 'string',
      nameSelect: 'string',
      valueSelect: 'string',
      chartTypeSelect: { name: 'chartType1' },
      chartOptions: 'any'
    };

    component.createChart(formValue);
    expect(component.charts.length).toEqual(1);
    expect(component.charts[0].chart).toEqual({ name: 'chartType1' });
    component.removeChart(component.charts[0]);
    expect(component.charts.length).toEqual(0);
  });
});
