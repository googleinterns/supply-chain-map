import { Component, OnInit } from '@angular/core';
import { ScmBasicProfile, GoogleAuthService } from '../../services/google-auth/google-auth.service';

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

  async ngOnInit() {
    this.profileData = await this.googleAuth.getProfileData();
  }

  /**
   * Encapsulate private property using this method.
   */
  signOut() {
    this.googleAuth.signOut();
  }

}
