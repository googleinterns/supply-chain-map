import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BigQueryService } from '../big-query/big-query.service';
import { FormQueryResult, FormQueryResponse, FormQueryResultSchema, FormQueryResultStats } from '../../home.models';

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
    try {
      const request = await this.bigQueryService.runQuery(query);
      const result = request.result;

      if (!this.validateQueryResponse(result)) {
        throw new Error('Invalid query');
      }

      /**
       * Get result in an understandable format
       */
      const formQueryResult = this.convertQueryResultFormat(result);
      /**
       * Get the resultant schema
       */
      const formQueryResultSchema: FormQueryResultSchema = {
        upstream: {
          fields: []
        },
        cm: {
          fields: []
        },
        downstream: {
          fields: []
        }
      };
      // Upstream
      for (const field of result.schema.fields[0].fields) {
        formQueryResultSchema.upstream.fields.push({
          name: field.name,
          type: field.type,
          mode: field.mode
        });
      }
      // Cm
      for (const field of result.schema.fields[1].fields) {
        formQueryResultSchema.cm.fields.push({
          name: field.name,
          type: field.type,
          mode: field.mode
        });
      }
      // Downstream
      for (const field of result.schema.fields[2].fields) {
        formQueryResultSchema.downstream.fields.push({
          name: field.name,
          type: field.type,
          mode: field.mode
        });
      }
      /**
       * Get other stats from response
       */
      const formQueryResultStats: FormQueryResultStats = {
        projectId: result.jobReference.projectId,
        jobId: result.jobReference.jobId,
        totalBytesProcessed: result.totalBytesProcessed,
        jobComplete: result.jobComplete,
        cacheHit: result.cacheHit

      };
      return {
        formQueryResult: formQueryResult,
        formQueryResultSchema: formQueryResultSchema,
        formQueryResultStats: formQueryResultStats
      };
    } catch (err) {
      if (!environment.production) {
        console.error(err);
      }
    }
  }

  private validateQueryResponse(result): boolean {

    /** should return exactly one row */
    if (parseInt(result.totalRows, 10) !== 1) {
      return false;
    }

    /** check if the 3 columns (upstream,cm,downstream) exist */
    if (result.schema.fields.length !== 3) {
      return false;
    }


    /** check upstream row is valid */
    if (result.schema.fields[0].type !== 'RECORD' || result.schema.fields[0].fields.length !== 12) {
      return false;
    }

    /** check cm row is valid */
    if (result.schema.fields[1].type !== 'RECORD' || result.schema.fields[1].fields.length !== 10) {
      return false;
    }

    /** check upstream row is valid */
    if (result.schema.fields[2].type !== 'RECORD' || result.schema.fields[2].fields.length !== 9) {
      return false;
    }

    return true;
  }

  private convertQueryResultFormat(result): FormQueryResult {
    let queryResultData: FormQueryResult;

    /** Extract the 3 columns from the resulting row */
    const upstreamCol = result.rows[0].f[0].v;
    const cmCol = result.rows[0].f[1].v;
    const downstreamCol = result.rows[0].f[2].v;

    /** The upstream column is an array of upstream
     * rows. Extract the array
     */
    const upstreamData = [];
    for (const upstreamRowInCol of upstreamCol) {
      upstreamData.push({
        product: upstreamRowInCol.v.f[0].v,
        parent_sku: upstreamRowInCol.v.f[1].v,
        part_number: upstreamRowInCol.v.f[2].v,
        description: upstreamRowInCol.v.f[3].v,
        category: upstreamRowInCol.v.f[4].v,
        supplier_name: upstreamRowInCol.v.f[5].v,
        lead_time: upstreamRowInCol.v.f[6].v,
        mfg_city: upstreamRowInCol.v.f[7].v,
        mfg_state: upstreamRowInCol.v.f[8].v,
        mfg_country: upstreamRowInCol.v.f[9].v,
        mfg_lat: parseInt(upstreamRowInCol.v.f[10].v, 10),
        mfg_long: parseInt(upstreamRowInCol.v.f[11].v, 10)
      });
    }

    /** The cm column is an array of cm
     * rows. Extract the array
     */
    const cmData = [];
    for (const cmRowInCol of cmCol) {
      cmData.push({
        product: cmRowInCol.v.f[0].v,
        sku: cmRowInCol.v.f[1].v,
        description: cmRowInCol.v.f[2].v,
        cm_name: cmRowInCol.v.f[3].v,
        lead_time: cmRowInCol.v.f[4].v,
        cm_city: cmRowInCol.v.f[5].v,
        cm_state: cmRowInCol.v.f[6].v,
        cm_country: cmRowInCol.v.f[7].v,
        cm_lat: parseInt(cmRowInCol.v.f[8].v, 10),
        cm_long: parseInt(cmRowInCol.v.f[9].v, 10)
      });
    }

    /** The downstream column is an array of downstream
     * rows. Extract the array
     */
    const downstreamData = [];
    for (const downstreamRowInCol of downstreamCol) {
      downstreamData.push({
        product: downstreamRowInCol.v.f[0].v,
        sku: downstreamRowInCol.v.f[1].v,
        gdc_code: downstreamRowInCol.v.f[2].v,
        lead_time: downstreamRowInCol.v.f[3].v,
        gdc_city: downstreamRowInCol.v.f[4].v,
        gdc_state: downstreamRowInCol.v.f[5].v,
        gdc_country: downstreamRowInCol.v.f[6].v,
        gdc_lat: parseInt(downstreamRowInCol.v.f[7].v, 10),
        gdc_long: parseInt(downstreamRowInCol.v.f[8].v, 10)
      });
    }

    queryResultData = {
      upstream: upstreamData,
      cm: cmData,
      downstream: downstreamData
    };

    return queryResultData;
  }
}
