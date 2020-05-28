import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'scm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output()
  menuClick = new EventEmitter();

  isNavOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  public menuClicked() {
    this.isNavOpen = !this.isNavOpen;
    this.menuClick.emit(this.isNavOpen ? 'open' : 'close');
  }

}
