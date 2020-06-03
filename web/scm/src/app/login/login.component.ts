import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from '../services/google-auth/google-auth.service';

@Component({
  selector: 'scm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private googleAuth: GoogleAuthService) { }

  ngOnInit(): void {
  }

  /**
   * Use the GoogleAuthService object to sign in the user
   */
  signIn() {
    this.googleAuth.signIn();
  }
}
