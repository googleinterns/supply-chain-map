import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { GoogleAuthService, ScmBasicProfile } from '../services/gapi/GoogleAuthService';

@Component({
  selector: 'scm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output()
  menuClick = new EventEmitter();

  isNavOpen = false;
  profileData: ScmBasicProfile;

  constructor(private googleAuth: GoogleAuthService) {
    this.profileData = googleAuth.getProfileData();
  }

  ngOnInit(): void {
  }

  public menuClicked() {
    this.isNavOpen = !this.isNavOpen;
    this.menuClick.emit(this.isNavOpen ? 'open' : 'close');
  }

  public signOut() {
    this.googleAuth.signOut();
  }

}
