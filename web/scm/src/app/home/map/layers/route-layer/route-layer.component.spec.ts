import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouteLayerComponent } from './route-layer.component';
import { MemoizedSelector } from '@ngrx/store';
import { HomeState } from 'src/app/home/store/state';
import { FormQueryResult } from 'src/app/home/home.models';
import { selectHomeFormQueryResult } from 'src/app/home/store/selectors';

describe('RouteLayerComponent', () => {
  let component: RouteLayerComponent;
  let fixture: ComponentFixture<RouteLayerComponent>;
  let mockStore: MockStore;
  let mockFormQuerySelector: MemoizedSelector<HomeState, FormQueryResult>;

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
    fixture = TestBed.createComponent(RouteLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
