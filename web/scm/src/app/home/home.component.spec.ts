import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { MapComponent } from '../map/map.component';
import { SidePanelComponent } from '../side-panel/side-panel.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MapComponent,
        SidePanelComponent
      ],
      imports: [
        BrowserAnimationsModule,
        BrowserModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the home component', () => {
    expect(component).toBeTruthy();
  });

  it('should display side panel', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('scm-side-panel')).toBeTruthy();
  });

  it('should display map', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('scm-map')).toBeTruthy();
  });
});
