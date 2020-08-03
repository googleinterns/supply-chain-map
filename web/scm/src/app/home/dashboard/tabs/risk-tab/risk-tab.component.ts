import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectRiskIsLoading, selectRiskError } from './store/selectors';

@Component({
    selector: 'scm-risk-tab',
    templateUrl: './risk-tab.component.html',
    styleUrls: ['./risk-tab.component.scss',
        '../../../../../../node_modules/@swimlane/ngx-datatable/index.scss',
        '../../../../../../node_modules/@swimlane/ngx-datatable/themes/material.scss',
        '../../../../../../node_modules/@swimlane/ngx-datatable/assets/icons.css'],
    encapsulation: ViewEncapsulation.None
})
export class RiskTabComponent {
    isLoading$: Observable<boolean>;
    error$: Observable<Error>;

    public constructor(private store: Store) {
        this.isLoading$ = this.store.select(selectRiskIsLoading);
        this.error$ = this.store.select(selectRiskError);
    }

}
