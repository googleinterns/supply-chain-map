import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment.sample';


@Injectable({
  providedIn: 'root'
})
export class BigQueryService {
  constructor(private http: HttpClient) { }

  runQuery(query: string) {
    const payload = {
      sqlQuery: query
    };

    return this.http.post<{ result: boolean, data: [] }>(environment.cloudFunctionUrl, payload);
  }
}
