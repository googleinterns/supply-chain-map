import { Injectable } from '@angular/core';
import { BigQueryService } from '../big-query/big-query.service';
import { environment } from 'src/environments/environment';

/**
 * The return type expected after running the query
 * obtained from side panel form.
 */
export interface FormQueryResult {
  upstream: {
    product: string,
    parent_sku: string,
    part_number: string,
    description: string,
    category: string,
    supplier_name: string,
    lead_time: string,
    mfg_city: string,
    mfg_state: string,
    mfg_country: string,
    mfg_lat: number,
    mfg_long: number
  }[];
  cm: {
    product: string,
    sku: string,
    description: string,
    cm_name: string,
    lead_time: string,
    cm_city: string,
    cm_state: string,
    cm_country: string,
    cm_lat: number,
    cm_long: number
  }[];
  downstream: {
    product: string,
    sku: string,
    gdc_code: string,
    lead_time: string,
    gdc_city: string,
    gdc_state: string,
    gdc_country: string,
    gdc_lat: number,
    gdc_long: number
  }[];
}

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
  public async runFormQuery(query: string): Promise<FormQueryResult> {

    try {
      const request = await this.bigQueryService.runQuery(query);
      const result = request.result;

      if (!this.validateQueryResponse(result)) {
        throw new Error('Invalid query');
      }

      const formQueryResult = this.convertQueryResultFormat(result);
      console.log(formQueryResult);
      return formQueryResult;
    } catch (err) {
      if (!environment.production) {
        console.error(err);
      }
    }
  }

  private validateQueryResponse(result): boolean {
    /** check if one row exists */
    if (!(result.rows instanceof Array) || result.rows[0] === undefined) {
      return false;
    }

    /** check if the 3 columns (upstream,cm,downstream) exist */
    if (!(result.rows[0].f instanceof Array) || result.rows[0].f.length  < 3) {
      return false;
    }


    /** check upstream row is valid */
    const upstreamCol = result.rows[0].f[0].v;
    if (upstreamCol instanceof Array) {
      if (!(upstreamCol[0].v.f instanceof Array) || upstreamCol[0].v.f.length !== 12) {
        return false;
      }
    }

    /** check cm row is valid */
    const cmCol = result.rows[0].f[1].v;
    if (cmCol instanceof Array) {
      if (!(cmCol[0].v.f instanceof Array) || cmCol[0].v.f.length !== 10) {
        return false;
      }
    }

    /** check upstream row is valid */
    const downstreamCol = result.rows[0].f[2].v;
    if (downstreamCol instanceof Array) {
      if (!(downstreamCol[0].v.f instanceof Array) || downstreamCol[0].v.f.length !== 9) {
        return false;
      }
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
