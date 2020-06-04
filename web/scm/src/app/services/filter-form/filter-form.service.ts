import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BigQueryService } from '../big-query/big-query.service';
import { FormGroup } from '@angular/forms';
import { data } from './data';

/**
 * This service provides data to the various form
 * fields on SidePanelComponent.
 */
@Injectable({
  providedIn: 'root'
})
export class FilterFormService {

  /**
   * Query to get product, supplier, category details
   * from the BigQuery dataset.
   */
  private static readonly SQL_UNIQUE_PRODUCT_SUPPLIER_CATEGORY = `
      SELECT
      ARRAY(
        SELECT DISTINCT _product
        FROM (
          SELECT DISTINCT ${ environment.bigQuery.tables.UPSTREAM.columns.PRODUCT} AS _product
          FROM ${ environment.bigQuery.tables.UPSTREAM.tableName}
          UNION ALL
          SELECT DISTINCT ${ environment.bigQuery.tables.CM.columns.PRODUCT} AS _product
          FROM ${ environment.bigQuery.tables.CM.tableName}
          UNION ALL
          SELECT DISTINCT ${ environment.bigQuery.tables.DOWNSTREAM.columns.PRODUCT} AS _product
          FROM ${ environment.bigQuery.tables.DOWNSTREAM.tableName}
        )
        WHERE _product IS NOT NULL
      ) AS products,

      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.UPSTREAM.columns.SUPPLIER_NAME}
        FROM ${ environment.bigQuery.tables.UPSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.UPSTREAM.columns.SUPPLIER_NAME} IS NOT NULL
      ) AS upstream_suppliers,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.UPSTREAM.columns.CATEGORY}
        FROM ${ environment.bigQuery.tables.UPSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.UPSTREAM.columns.CATEGORY} IS NOT NULL
      ) AS upstream_categories,

      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.UPSTREAM.columns.MFG_COUNTRY}
        FROM ${ environment.bigQuery.tables.UPSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.UPSTREAM.columns.MFG_COUNTRY} IS NOT NULL
      ) AS upstream_countries,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.UPSTREAM.columns.MFG_STATE}
        FROM ${ environment.bigQuery.tables.UPSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.UPSTREAM.columns.MFG_STATE} IS NOT NULL
      ) AS upstream_states,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.UPSTREAM.columns.MFG_CITY}
        FROM ${ environment.bigQuery.tables.UPSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.UPSTREAM.columns.MFG_CITY} IS NOT NULL
      ) AS upstream_cities,

      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.CM.columns.CM_COUNTRY}
        FROM ${ environment.bigQuery.tables.CM.tableName}
        WHERE ${ environment.bigQuery.tables.CM.columns.CM_COUNTRY} IS NOT NULL
      ) AS cm_countries,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.CM.columns.CM_STATE}
        FROM ${ environment.bigQuery.tables.CM.tableName}
        WHERE ${ environment.bigQuery.tables.CM.columns.CM_STATE} IS NOT NULL
      ) AS cm_states,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.CM.columns.CM_CITY}
        FROM ${ environment.bigQuery.tables.CM.tableName}
        WHERE ${ environment.bigQuery.tables.CM.columns.CM_CITY} IS NOT NULL
      ) AS cm_cities,

      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.DOWNSTREAM.columns.GDC_COUNTRY}
        FROM ${ environment.bigQuery.tables.DOWNSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.DOWNSTREAM.columns.GDC_COUNTRY} IS NOT NULL
      ) AS gdc_countries,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.DOWNSTREAM.columns.GDC_STATE}
        FROM ${ environment.bigQuery.tables.DOWNSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.DOWNSTREAM.columns.GDC_STATE} IS NOT NULL
      ) AS gdc_states,
      ARRAY(
        SELECT DISTINCT ${ environment.bigQuery.tables.DOWNSTREAM.columns.GDC_CITY}
        FROM ${ environment.bigQuery.tables.DOWNSTREAM.tableName}
        WHERE ${ environment.bigQuery.tables.DOWNSTREAM.columns.GDC_CITY} IS NOT NULL
      ) AS gdc_cities,
  `;

  constructor(private bigQueryService: BigQueryService) { }

  /**
   * Query BigQuery using @var SQL_UNIQUE_PRODUCT_SUPPLIER_CATEGORY string
   */
  async getFilterData() {
    let filterData = {
      products: [],
      upstream_categories: [],
      upstream_suppliers: [],
      upstream_countries: [],
      upstream_states: [],
      upstream_cities: [],
      cm_countries: [],
      cm_states: [],
      cm_cities: [],
      downstream_countries: [],
      downstream_states: [],
      downstream_cities: []
    };

    try {
      /* const request = await this.bigQueryService.runQuery(FilterFormService.SQL_UNIQUE_PRODUCT_SUPPLIER_CATEGORY);
      const result = request.result; */
      const result = data;
      filterData = {
        products: result.rows[0].f[0].v.map(e => e.v),
        upstream_suppliers: result.rows[0].f[1].v.map(e => e.v),
        upstream_categories: result.rows[0].f[2].v.map(e => e.v),
        upstream_countries: result.rows[0].f[3].v.map(e => e.v),
        upstream_states: result.rows[0].f[4].v.map(e => e.v),
        upstream_cities: result.rows[0].f[5].v.map(e => e.v),
        cm_countries: result.rows[0].f[6].v.map(e => e.v),
        cm_states: result.rows[0].f[7].v.map(e => e.v),
        cm_cities: result.rows[0].f[8].v.map(e => e.v),
        downstream_countries: result.rows[0].f[9].v.map(e => e.v),
        downstream_states: result.rows[0].f[10].v.map(e => e.v),
        downstream_cities: result.rows[0].f[11].v.map(e => e.v)
      };
    } catch (err) {
      if (!environment.production) {
        console.error(err);
      }
    }

    return filterData;
  }

  /**
   * submitForm
   */
  public submitForm(filterForm: FormGroup) {
    const filterSelection = filterForm.value;
    console.log(this.convertFormToQuery(filterSelection));
  }

  private convertFormToQuery(filterSelection) {

    /**
     * Selected products subquery
     */
    let SQL_PRODUCT_SUBQUERY = '1 = 1';
    if (filterSelection.basicFilterGroup.productFilterGroup.productSelect != null) {
      SQL_PRODUCT_SUBQUERY =
        `${environment.bigQuery.tables.UPSTREAM.columns.PRODUCT}
        IN (${ filterSelection.basicFilterGroup.productFilterGroup.productSelect.map((e: string) => `'${e}'`).join(', ')})`;
    }

    /**
     * Subquery to get upstream data
     */
    const SQL_UPSTREAM_SUBQUERY_CONDITIONS = [SQL_PRODUCT_SUBQUERY];
    /** Add condition for upstream filter (categories, suppliers, location) */
    SQL_UPSTREAM_SUBQUERY_CONDITIONS.push(...this.getUpstreamFormSubquery(filterSelection.upstreamFilterGroup));
    /** Create the select query */
    const UPSTREAM_COLUMNS = environment.bigQuery.tables.UPSTREAM.columns;
    const SQL_UPSTREAM_SUBQUERY = `
      SELECT AS STRUCT
          ${UPSTREAM_COLUMNS.PRODUCT},
          ${UPSTREAM_COLUMNS.PART_NUMBER},
          ${UPSTREAM_COLUMNS.DESCRIPTION},
          ${UPSTREAM_COLUMNS.CATEGORY},
          ${UPSTREAM_COLUMNS.SUPPLIER_NAME},
          ${UPSTREAM_COLUMNS.LEAD_TIME},
          ${UPSTREAM_COLUMNS.MFG_CITY},
          ${UPSTREAM_COLUMNS.MFG_STATE},
          ${UPSTREAM_COLUMNS.MFG_COUNTRY},
          ${UPSTREAM_COLUMNS.MFG_LAT},
          ${UPSTREAM_COLUMNS.MFG_LONG}
      FROM
          ${environment.bigQuery.tables.UPSTREAM.tableName}
      WHERE
          ${SQL_UPSTREAM_SUBQUERY_CONDITIONS.join(' AND ')}
    `;


    /**
     * Subquery to get CM data
     */
    const SQL_CM_SUBQUERY_CONDITIONS = [SQL_PRODUCT_SUBQUERY];
    /** Add condition for upstream filter (categories, suppliers, location) */
    SQL_CM_SUBQUERY_CONDITIONS.push(...this.getCmFormSubquery(filterSelection.cmFilterGroup));
    /** Create the select query */
    const CM_COLUMNS = environment.bigQuery.tables.CM.columns;
    const SQL_CM_SUBQUERY = `
      SELECT AS STRUCT
          ${CM_COLUMNS.PRODUCT},
          ${CM_COLUMNS.DESCRIPTION},
          ${CM_COLUMNS.CM_NAME},
          ${CM_COLUMNS.LEAD_TIME},
          ${CM_COLUMNS.CM_CITY},
          ${CM_COLUMNS.CM_STATE},
          ${CM_COLUMNS.CM_COUNTRY},
          ${CM_COLUMNS.CM_LAT},
          ${CM_COLUMNS.CM_LONG}
      FROM
          ${environment.bigQuery.tables.CM.tableName}
      WHERE
          ${SQL_CM_SUBQUERY_CONDITIONS.join(' AND ')}
    `;


    /**
     * Subquery to get downstream data
     */
    const SQL_DOWNSTREAM_SUBQUERY_CONDITIONS = [SQL_PRODUCT_SUBQUERY];
    /** Add condition for upstream filter (categories, suppliers, location) */
    SQL_DOWNSTREAM_SUBQUERY_CONDITIONS.push(...this.getDownstreamFormSubquery(filterSelection.downstreamFilterGroup));
    /** Create the select query */
    const DOWNSTREAM_COLUMNS = environment.bigQuery.tables.DOWNSTREAM.columns;
    const SQL_DOWNSTREAM_SUBQUERY = `
      SELECT AS STRUCT
          ${DOWNSTREAM_COLUMNS.PRODUCT},
          ${DOWNSTREAM_COLUMNS.GDC_CODE},
          ${DOWNSTREAM_COLUMNS.LEAD_TIME},
          ${DOWNSTREAM_COLUMNS.GDC_CITY},
          ${DOWNSTREAM_COLUMNS.GDC_STATE},
          ${DOWNSTREAM_COLUMNS.GDC_COUNTRY},
          ${DOWNSTREAM_COLUMNS.GDC_LAT},
          ${DOWNSTREAM_COLUMNS.GDC_LONG}
      FROM
          ${environment.bigQuery.tables.DOWNSTREAM.tableName}
      WHERE
          ${SQL_DOWNSTREAM_SUBQUERY_CONDITIONS.join(' AND ')}
    `;

    return `
      SELECT
      ARRAY(
        ${SQL_UPSTREAM_SUBQUERY}
      ) AS upstream,
      ARRAY(
        ${SQL_CM_SUBQUERY}
      ) AS cm,
      ARRAY(
        ${SQL_DOWNSTREAM_SUBQUERY}
      ) AS downstream
    `;
  }

  private getBasicFormSubquery(basicFilterGroup): string[] {
    const conditions = [];

    return conditions;
  }

  private getUpstreamFormSubquery(upstreamFilterGroup): string[] {
    const conditions = [];

    /**
     * Get the selected categories
     */
    if (upstreamFilterGroup.componentFilterGroup.categorySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.UPSTREAM.columns.CATEGORY}
        IN (${ upstreamFilterGroup.componentFilterGroup.categorySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected suppliers
     */
    if (upstreamFilterGroup.componentFilterGroup.supplierSelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.UPSTREAM.columns.SUPPLIER_NAME}
        IN (${ upstreamFilterGroup.componentFilterGroup.supplierSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected countries
     */
    if (upstreamFilterGroup.locationFilterGroup.countrySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.UPSTREAM.columns.MFG_COUNTRY}
        IN (${ upstreamFilterGroup.locationFilterGroup.countrySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected states
     */
    if (upstreamFilterGroup.locationFilterGroup.regionSelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.UPSTREAM.columns.MFG_STATE}
        IN (${ upstreamFilterGroup.locationFilterGroup.regionSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected cities
     */
    if (upstreamFilterGroup.locationFilterGroup.citySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.UPSTREAM.columns.MFG_CITY}
        IN (${ upstreamFilterGroup.locationFilterGroup.citySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get lead time subquery
     */
    conditions.push(
      this.getLeadTimeSubquery(
        environment.bigQuery.tables.UPSTREAM.columns.LEAD_TIME,
        upstreamFilterGroup.additionalFilterGroup.minLeadTimeInput,
        upstreamFilterGroup.additionalFilterGroup.maxLeadTimeInput
      )
    );

    return conditions;
  }

  private getCmFormSubquery(cmFilterGroup): string[] {
    const conditions = [];

    /**
     * Get the selected countries
     */
    if (cmFilterGroup.locationFilterGroup.countrySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.CM.columns.CM_COUNTRY}
        IN (${ cmFilterGroup.locationFilterGroup.countrySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected states
     */
    if (cmFilterGroup.locationFilterGroup.regionSelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.CM.columns.CM_STATE}
        IN (${ cmFilterGroup.locationFilterGroup.regionSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected cities
     */
    if (cmFilterGroup.locationFilterGroup.citySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.CM.columns.CM_CITY}
        IN (${ cmFilterGroup.locationFilterGroup.citySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get lead time subquery
     */
    conditions.push(
      this.getLeadTimeSubquery(
        environment.bigQuery.tables.UPSTREAM.columns.LEAD_TIME,
        cmFilterGroup.additionalFilterGroup.minLeadTimeInput,
        cmFilterGroup.additionalFilterGroup.maxLeadTimeInput
      )
    );

    return conditions;
  }

  private getDownstreamFormSubquery(downstreamFilterGroup): string[] {
    const conditions = [];

    /**
     * Get the selected countries
     */
    if (downstreamFilterGroup.locationFilterGroup.countrySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.DOWNSTREAM.columns.GDC_COUNTRY}
        IN (${ downstreamFilterGroup.locationFilterGroup.countrySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected states
     */
    if (downstreamFilterGroup.locationFilterGroup.regionSelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.DOWNSTREAM.columns.GDC_STATE}
        IN (${ downstreamFilterGroup.locationFilterGroup.regionSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected cities
     */
    if (downstreamFilterGroup.locationFilterGroup.citySelect != null) {
      conditions.push(
        `${environment.bigQuery.tables.DOWNSTREAM.columns.GDC_CITY}
        IN (${ downstreamFilterGroup.locationFilterGroup.citySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get lead time subquery
     */
    conditions.push(
      this.getLeadTimeSubquery(
        environment.bigQuery.tables.UPSTREAM.columns.LEAD_TIME,
        downstreamFilterGroup.additionalFilterGroup.minLeadTimeInput,
        downstreamFilterGroup.additionalFilterGroup.maxLeadTimeInput
      )
    );

    return conditions;
  }

  private getLeadTimeSubquery(field: string, min: number | null, max: number | null): string {
    if (min != null && max != null) {
      return `${field} BETWEEN ${min} AND ${max}`;
    } else if (min != null && max == null) {
      return `${field} >= ${min}`;
    } else if (min == null && max != null) {
      return `${field} <= ${max}`;
    } else {
      return '1 = 1';
    }
  }
}
