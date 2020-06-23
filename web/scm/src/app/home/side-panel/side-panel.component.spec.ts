import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelComponent } from './side-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MemoizedSelector } from '@ngrx/store';
import { SidePanelState } from './store/state';
import { SidePanel } from './side-panel.models';
import { selectSidePanelData, selectSidePanelIsLoading, selectSidePanelError } from './store/selectors';
import { sidePanelInitDataRequest } from './store/actions';

describe('SidePanelComponent', () => {
  let component: SidePanelComponent;
  let fixture: ComponentFixture<SidePanelComponent>;
  let mockStore: MockStore;
  let mockSidePanelDataSelector: MemoizedSelector<SidePanelState, SidePanel>;
  let mockIsLoadingSelector: MemoizedSelector<SidePanelState, boolean>;
  let mockErrorSelector: MemoizedSelector<SidePanelState, Error>;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidePanelComponent
      ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        ReactiveFormsModule
      ],
      providers: [
        provideMockStore()
      ]
    })
      .compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockSidePanelDataSelector = mockStore.overrideSelector(
      selectSidePanelData,
      null
    );
    mockIsLoadingSelector = mockStore.overrideSelector(
      selectSidePanelIsLoading,
      false
    );
    mockErrorSelector = mockStore.overrideSelector(
      selectSidePanelError,
      null
    );

    dispatchSpy = spyOn(mockStore, 'dispatch');

  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch init action', () => {
    expect(dispatchSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(sidePanelInitDataRequest());
  });
});
