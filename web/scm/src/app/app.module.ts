import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from 'src/app/app.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from 'src/app/map/map.component';
import { SidePanelComponent } from 'src/app/side-panel/side-panel.component';
import { UpstreamFilterComponent } from './side-panel/upstream-filter/upstream-filter.component';
import { CmFilterComponent } from './side-panel/cm-filter/cm-filter.component';
import { DownstreamFilterComponent } from './side-panel/downstream-filter/downstream-filter.component';
import { BasicFilterComponent } from './side-panel/basic-filter/basic-filter.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    HomeComponent,
    SidePanelComponent,
    UpstreamFilterComponent,
    CmFilterComponent,
    DownstreamFilterComponent,
    BasicFilterComponent,
    LoginComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApi
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
