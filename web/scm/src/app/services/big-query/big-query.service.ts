import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { GoogleAuthService } from '../google-auth/google-auth.service';
import { Observable } from 'rxjs';

/**
 * This is a service that is used to communicate with BigQuery service in GCP
 */
@Injectable({
  providedIn: 'root'
})
export class BigQueryService {

  constructor(private http: HttpClient, private googleAuth: GoogleAuthService) { }

  /**
   * The method hits the BigQuery v2.jobs.query API.
   * @param query This is the query that will be executed in BigQuery
   * @returns am observable that contains the data returned by BigQuery
   */
  runQuery(query: string): Observable<any> {
    /** This is the OAuth2.0 token that is used to authenticate the request */
    const token = this.googleAuth.getOauthToken();

    if (!token) {
      throw new Error('Authentication failed. User not logged in');
    }

    /** The request body that is sent to BigQuery.
     * Structure found here: https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query#QueryRequest
     */
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
