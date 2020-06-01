import { Component, OnInit } from '@angular/core';
import { GoogleAuthService, ScmBasicProfile } from '../services/google-auth/google-auth.service';

@Component({
  selector: 'scm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * Holds basic information of the logged in user.
   * Provided by GoogleAuthService
   */
  profileData: ScmBasicProfile;

  constructor(private googleAuth: GoogleAuthService) {
  }

  ngOnInit(): void {
    this.profileData = this.googleAuth.getProfileData();
  }

  /**
   * Encapsulate private property using this method.
   */
  signOut() {
    this.googleAuth.signOut();
  }

}
