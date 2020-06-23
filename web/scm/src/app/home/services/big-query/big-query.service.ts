import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * This is a service that is used to communicate with BigQuery service in GCP
 */
@Injectable({
  providedIn: 'root'
})
export class BigQueryService {

  constructor() {
    this.loadBigQuery().subscribe();
  }

  /**
   * Load the BigQuery client onto the Gapi library.
   */
  private loadBigQuery(): Observable<void> {
    if (gapi.client && gapi.client['bigquery']) {
      return of();
    }
    return new Observable((observer: Observer<void>) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          clientId: environment.clientId,
          scope: environment.bigQuery.scope
        });
        await gapi.client.load('bigquery', 'v2');
        observer.next();
        observer.complete();
      });
    });
  }

  /**
   * The method hits the BigQuery v2.jobs.query API.
   * @param query This is the query that will be executed in BigQuery
   * @returns am observable that contains the data returned by BigQuery
   */
  runQuery(query: string): Promise<gapi.client.Request<gapi.client.bigquery.QueryResponse>> {
    /**
     * Prepare the data.
     */
    return this.loadBigQuery().toPromise()
      .then(
        () => gapi.client['bigquery'].jobs.query({
          projectId: environment.projectId,
          query: query,
          useLegacySql: false,
          defaultDataset: {
            datasetId: environment.bigQuery.layerDatasets.route.dataset,
            projectId: environment.projectId
          }
        })
      );
  }

  public convertResult(result: gapi.client.bigquery.QueryResponse) {
    const rows = [];
    const fetchedRows = result.rows ?? [];
    const fields = result.schema.fields;
    for (const fetchedRow of fetchedRows) {
      const row = {};
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].mode === 'REPEATED') {
          if (fields[i].type === 'RECORD') {
            row[fields[i].name] = this.convertResult({ schema: fields[i], rows: fetchedRow.f[i].v.map(e => e.v) });
          } else {
            row[fields[i].name] = fetchedRow.f[i].v.map(e => e.v);
          }
        } else if (fields[i].type === 'RECORD') {
          row[fields[i].name] = this.convertResult({ schema: fields[i], rows: [fetchedRow.f[i].v] })[0];
        } else {
          row[fields[i].name] = fetchedRow.f[i].v;
        }
      }
      rows.push(row);
    }
    return rows;
  }
}
