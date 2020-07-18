import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphTabComponent } from './graph-tab.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { FormQueryResult } from 'src/app/home/home.models';
import { HomeState } from 'src/app/home/store/state';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';
import { MatDialogModule } from '@angular/material/dialog';

describe('GraphTabComponent', () => {
  let component: GraphTabComponent;
  let fixture: ComponentFixture<GraphTabComponent>;
  let mockStore: MockStore;
  let mockFormQuerySelector: MemoizedSelector<HomeState, FormQueryResult>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatDialogModule ],
      declarations: [ GraphTabComponent ],
      providers: [
        provideMockStore()
      ]
    })
    .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockFormQuerySelector = mockStore.overrideSelector(
      selectHomeFormQueryResult,
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
});
