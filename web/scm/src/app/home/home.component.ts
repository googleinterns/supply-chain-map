import { Component, ViewChild } from '@angular/core';
import { MapComponent } from './map/map.component';
import { HomeHelperService } from './services/home-helper/home-helper.service';
import { Store } from '@ngrx/store';
import { HomeState } from './store/state';
import { formQueryFetchSuccess, formQueryFetchFailure } from './store/actions';

@Component({
  selector: 'scm-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(private homeHelper: HomeHelperService, private store: Store<HomeState>) { }

  public async queryGenerated(query: string) {
    try {
    const formQueryResult = await this.homeHelper.runFormQuery(query);
    this.store.dispatch(formQueryFetchSuccess({ formQueryResult: formQueryResult }));
    } catch (ex) {
      this.store.dispatch(formQueryFetchFailure({ error: ex }));
    }
  }
}
