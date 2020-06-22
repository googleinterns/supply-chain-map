import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HomeState } from './store/state';
import { MemoizedSelector } from '@ngrx/store';
import { selectHomeIsLoading, selectHomeError } from './store/selectors';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: MockStore;
  let mockLoadingSelector: MemoizedSelector<HomeState, boolean>;
  let mockErrorSelector: MemoizedSelector<HomeState, Error>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        RouterTestingModule
      ],
      providers: [
        provideMockStore()
      ]
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockLoadingSelector = mockStore.overrideSelector(
      selectHomeIsLoading,
      false
    );
    mockErrorSelector = mockStore.overrideSelector(
      selectHomeError,
      null
    );
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
