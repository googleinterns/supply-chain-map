import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment.sample';
import { GoogleAuthService } from '../gapi/GoogleAuthService';


@Injectable({
  providedIn: 'root'
})
export class BigQueryService {
  constructor(private http: HttpClient, private googleAuth: GoogleAuthService) { }

  runQuery(query: string) {
    const token = this.googleAuth.getOauthToken();

    if (!token) {
      throw new Error('Authentication failed. User not logged in');
    }

    const payload = {
      query
    };

    const httpOptions = {
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + token)
    };

    return this.http.post<{ result: boolean, data: [] }>(
        environment.bigQuery.apiUrl + '/bigquery/v2/projects/' + environment.projectId + '/queries',
        payload,
        httpOptions);
  }
}
