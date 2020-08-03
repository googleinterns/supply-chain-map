import { Injectable } from '@angular/core';
import { constants } from 'src/constants';
import { BigQueryService } from '../big-query/big-query.service';
import { FormQueryResponse, FormQueryResultStats } from '../../home.models';

@Injectable({
  providedIn: 'root'
})
export class HomeHelperService {

  constructor(private bigQueryService: BigQueryService) { }

  /**
   * Runs the query using the bigquery service and reformats
   * the response into understandable format
   * @param query The query obtained from side panel form
   */
  public async runFormQuery(query: string): Promise<FormQueryResponse> {
    const request = await this.bigQueryService.runQuery(query);
    const formattedResult = this.bigQueryService.convertResult(request.result)[0];

    if (!this.validateFormattedResult(formattedResult)) {
      throw new Error('Invalid Query');
    }

    /**
     * Get other stats from response
     */
    const formQueryResultStats: FormQueryResultStats = {
      projectId: request.result.jobReference.projectId,
      jobId: request.result.jobReference.jobId,
      totalBytesProcessed: request.result.totalBytesProcessed,
      jobComplete: request.result.jobComplete,
      cacheHit: request.result.cacheHit

    };
    return {
      formQueryResult: formattedResult,
      formQueryResultStats: formQueryResultStats
    };
  }

  private validateFormattedResult(formattedResult) {
    /**
     * Check if upstream is present
     */
    if ('upstream' in formattedResult) {
      /**
       * Check if it is an array
       */
      if (!(formattedResult.upstream instanceof Array)) {
        return false;
      }

      /**
       * Check if all properties exist
       */
      if (formattedResult.upstream.length > 0) {
        for (const prop of Object.values(constants.bigQuery.datasets.route.tables.UPSTREAM.columns)) {
          if (!(prop in formattedResult.upstream[0])) {
            return false;
          }
        }
      }
    }

    /**
     * Check if upstream is present
     */
    if (!('cm' in formattedResult)) {
      return false;
    }

    /**
     * Check if it is an array
     */
    if (!(formattedResult.cm instanceof Array)) {
      return false;
    }

    /**
     * Check if all properties exist
     */
    if (formattedResult.cm.length > 0) {
      for (const prop of Object.values(constants.bigQuery.datasets.route.tables.CM.columns)) {
        if (!(prop in formattedResult.cm[0])) {
          return false;
        }
      }
    }

    /**
     * Check if downstream is present
     */
    if ('downstream' in formattedResult) {
      /**
       * Check if it is an array
       */
      if (!(formattedResult.downstream instanceof Array)) {
        return false;
      }

      /**
       * Check if all properties exist
       */
      if (formattedResult.downstream.length > 0) {
        for (const prop of Object.values(constants.bigQuery.datasets.route.tables.DOWNSTREAM.columns)) {
          if (!(prop in formattedResult.downstream[0])) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
