import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HomeComponent } from './home.component';
import { environment } from 'src/environments/environment';
import { MapComponent } from '../map/map.component';
import { SidePanelComponent } from '../side-panel/side-panel.component';

describe('AppComponent', () => {
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
        AgmCoreModule.forRoot({
          apiKey: environment.googleMapApi
        }),
        BrowserAnimationsModule,
        BrowserModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
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

  it('toolbar should display \'Supply Chain Map\'', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1.product-name').textContent).toContain('Supply Chain Map');
  });

  it('should display side panel', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('scm-side-panel')).toBeTruthy();
  });

  it('should display map', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('agm-map')).toBeTruthy();
  });
});
