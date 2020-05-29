import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'scm-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isNavOpen = false;

  menuClicked() {
    this.isNavOpen = !this.isNavOpen;
  }
}
