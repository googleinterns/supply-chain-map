import { Component } from '@angular/core';
import { HomeHelperService } from '../services/home-helper/home-helper.service';

@Component({
  selector: 'scm-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private homeHelper: HomeHelperService) { }

  public queryGenerated(query: string) {
    this.homeHelper.runFormQuery(query);
  }
}
