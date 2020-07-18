import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home.component';
import { SidePanelModule } from './side-panel/side-panel.module';
import { MapModule } from './map/map.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { StoreModule } from '@ngrx/store';
import * as fromHome from './store/reducers';
import { HomeStoreEffects } from './store/effects';
import { EffectsModule } from '@ngrx/effects';
import { RightResizableDirective } from './directives/right-resizable.directive';
import { TopResizableDirective } from './directives/top-resizable.directive';
import { DashboardModule } from './dashboard/dashboard.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    TopResizableDirective,
    RightResizableDirective
  ],
  imports: [
    CommonModule,
    DashboardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    SidePanelModule,
    MapModule,
    StoreModule.forFeature('home', fromHome.reducer),
    EffectsModule.forFeature([HomeStoreEffects])
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
