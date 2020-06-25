import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SidePanel } from '../side-panel.models';
import { BigQueryService } from '../../services/big-query/big-query.service';

/**
 * The structure that a submitted form must follow
 */
export interface FormStructure {
  productFilterGroup: {
    productSelect: string[];
  };
  upstreamFilterGroup?: {
    componentFilterGroup: {
      categorySelect: string[];
      supplierSelect: string[];
    };
    locationFilterGroup: {
      countrySelect: string[];
      regionSelect: string[];
      citySelect: string[];
    };
    additionalFilterGroup: {
      minLeadTimeInput: number,
      maxLeadTimeInput: number
    };
  };
  downstreamFilterGroup?: {
    locationFilterGroup: {
      countrySelect: string[];
      regionSelect: string[];
      citySelect: string[];
    };
    additionalFilterGroup: {
      minLeadTimeInput: number;
      maxLeadTimeInput: number;
    };
  };
}

/**
 * This service provides methods that retrieves data
 * for the various form fields on SidePanelComponent.
 *
 * Also provides methods to query the BigQuery dataset
 * based on form selection
 */
@Injectable({
  providedIn: 'root'
})
export class FilterFormService {

  private static readonly environmentRouteTable = environment.bigQuery.layerDatasets.route.tables;
  /**
   * Query to get product, supplier, category details
   * from the BigQuery dataset.
   */
  private static readonly SQL_UNIQUE_PRODUCT_SUPPLIER_CATEGORY = `
      SELECT
      ARRAY(
        SELECT DISTINCT _product
        FROM (
          SELECT DISTINCT ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.PRODUCT} AS _product
          FROM ${ FilterFormService.environmentRouteTable.UPSTREAM.tableName}
          UNION ALL
          SELECT DISTINCT ${ FilterFormService.environmentRouteTable.CM.columns.PRODUCT} AS _product
          FROM ${ FilterFormService.environmentRouteTable.CM.tableName}
          UNION ALL
          SELECT DISTINCT ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.PRODUCT} AS _product
          FROM ${ FilterFormService.environmentRouteTable.DOWNSTREAM.tableName}
        )
        WHERE _product IS NOT NULL
      ) AS products,

      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.SUPPLIER_NAME}
        FROM ${ FilterFormService.environmentRouteTable.UPSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.SUPPLIER_NAME} IS NOT NULL
      ) AS upstream_suppliers,
      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.CATEGORY}
        FROM ${ FilterFormService.environmentRouteTable.UPSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.CATEGORY} IS NOT NULL
      ) AS upstream_categories,

      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_COUNTRY}
        FROM ${ FilterFormService.environmentRouteTable.UPSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_COUNTRY} IS NOT NULL
      ) AS upstream_countries,
      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_STATE}
        FROM ${ FilterFormService.environmentRouteTable.UPSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_STATE} IS NOT NULL
      ) AS upstream_states,
      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_CITY}
        FROM ${ FilterFormService.environmentRouteTable.UPSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_CITY} IS NOT NULL
      ) AS upstream_cities,

      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_COUNTRY}
        FROM ${ FilterFormService.environmentRouteTable.DOWNSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_COUNTRY} IS NOT NULL
      ) AS gdc_countries,
      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_STATE}
        FROM ${ FilterFormService.environmentRouteTable.DOWNSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_STATE} IS NOT NULL
      ) AS gdc_states,
      ARRAY(
        SELECT DISTINCT ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_CITY}
        FROM ${ FilterFormService.environmentRouteTable.DOWNSTREAM.tableName}
        WHERE ${ FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_CITY} IS NOT NULL
      ) AS gdc_cities,
  `;

  constructor(private bigQueryService: BigQueryService) { }

  /**
   * Query BigQuery using @var SQL_UNIQUE_PRODUCT_SUPPLIER_CATEGORY string
   */
  async getFilterData(): Promise<SidePanel> {

    try {
      const request = await this.bigQueryService.runQuery(FilterFormService.SQL_UNIQUE_PRODUCT_SUPPLIER_CATEGORY);
      const result = this.bigQueryService.convertResult(request.result)[0];

      const filterData = {
        product: {
          products: result.products,
        },
        upstream: {
          suppliers: result.upstream_suppliers,
          categories: result.upstream_categories,
          countries: result.upstream_countries,
          states: result.upstream_states,
          cities: result.upstream_cities,
        },
        downstream: {
          countries: result.gdc_countries,
          states: result.gdc_states,
          cities: result.gdc_cities
        }
      };

      return filterData;
    } catch (err) {
      if (!environment.production) {
        console.error(err);
      }

      return;
    }
  }

  /**
   * The passed in form is converted to a SQL query
   * @param filterSelection The form value to be converted. Must abide
   * by the interface FormStructure
   */
  public convertFormToQuery(filterSelection: FormStructure) {

    const FINAL_QUERY_SELECTS = [];
    /**
     * Selected products subquery
     */
    let SQL_PRODUCT_SUBQUERY = '1 = 1';
    if (filterSelection.productFilterGroup.productSelect != null) {
      SQL_PRODUCT_SUBQUERY =
        `${FilterFormService.environmentRouteTable.UPSTREAM.columns.PRODUCT}
        IN (${ filterSelection.productFilterGroup.productSelect.map((e: string) => `'${e}'`).join(', ')})`;
    }

    if (filterSelection.upstreamFilterGroup) {
      /**
       * Subquery to get upstream data
       */
      const SQL_UPSTREAM_SUBQUERY_CONDITIONS = [SQL_PRODUCT_SUBQUERY];
      /** Add condition for upstream filter (categories, suppliers, location) */
      SQL_UPSTREAM_SUBQUERY_CONDITIONS.push(...this.getUpstreamFormSubquery(filterSelection.upstreamFilterGroup));
      /** Create the select query */
      const UPSTREAM_COLUMNS = Object.values(FilterFormService.environmentRouteTable.UPSTREAM.columns);
      const SQL_UPSTREAM_SUBQUERY = `
      ARRAY(
        SELECT AS STRUCT
            ${UPSTREAM_COLUMNS.join(', ')}
        FROM
            ${FilterFormService.environmentRouteTable.UPSTREAM.tableName}
        WHERE
            ${SQL_UPSTREAM_SUBQUERY_CONDITIONS.join(' AND ')}
      ) AS upstream
      `;

      FINAL_QUERY_SELECTS.push(SQL_UPSTREAM_SUBQUERY);
    }

    if (filterSelection.downstreamFilterGroup) {
      /**
       * Subquery to get downstream data
       */
      const SQL_DOWNSTREAM_SUBQUERY_CONDITIONS = [SQL_PRODUCT_SUBQUERY];
      /** Add condition for upstream filter (categories, suppliers, location) */
      SQL_DOWNSTREAM_SUBQUERY_CONDITIONS.push(...this.getDownstreamFormSubquery(filterSelection.downstreamFilterGroup));
      /** Create the select query */
      const DOWNSTREAM_COLUMNS = Object.values(FilterFormService.environmentRouteTable.DOWNSTREAM.columns);
      const SQL_DOWNSTREAM_SUBQUERY = `
      ARRAY(
        SELECT AS STRUCT
            ${DOWNSTREAM_COLUMNS.join(', ')}
        FROM
            ${FilterFormService.environmentRouteTable.DOWNSTREAM.tableName}
        WHERE
            ${SQL_DOWNSTREAM_SUBQUERY_CONDITIONS.join(' AND ')}
      ) AS downstream
      `;

      FINAL_QUERY_SELECTS.push(SQL_DOWNSTREAM_SUBQUERY);
    }

    if (filterSelection.upstreamFilterGroup || filterSelection.downstreamFilterGroup) {
      /**
       * Subquery to get CM data
       */
      const SQL_CM_SUBQUERY_CONDITIONS = [SQL_PRODUCT_SUBQUERY];
      /** Create the select query */
      const CM_COLUMNS = Object.values(FilterFormService.environmentRouteTable.CM.columns);
      const SQL_CM_SUBQUERY = `
      ARRAY(
        SELECT AS STRUCT
            ${CM_COLUMNS.join(', ')}
        FROM
            ${FilterFormService.environmentRouteTable.CM.tableName}
        WHERE
            ${SQL_CM_SUBQUERY_CONDITIONS.join(' AND ')}
      ) AS cm
      `;

      FINAL_QUERY_SELECTS.push(SQL_CM_SUBQUERY);
    }


    return 'SELECT ' + FINAL_QUERY_SELECTS.join(',\n');
  }

  /**
   * Convert the upstream filter form group
   * @param upstreamFilterGroup The child form group.
   * Must be of type @var FormStructure.upstreamFilterGroup
   */
  private getUpstreamFormSubquery(upstreamFilterGroup): string[] {
    const conditions = [];

    /**
     * Get the selected categories
     */
    if (upstreamFilterGroup.componentFilterGroup.categorySelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.UPSTREAM.columns.CATEGORY}
        IN (${ upstreamFilterGroup.componentFilterGroup.categorySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected suppliers
     */
    if (upstreamFilterGroup.componentFilterGroup.supplierSelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.UPSTREAM.columns.SUPPLIER_NAME}
        IN (${ upstreamFilterGroup.componentFilterGroup.supplierSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected countries
     */
    if (upstreamFilterGroup.locationFilterGroup.countrySelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_COUNTRY}
        IN (${ upstreamFilterGroup.locationFilterGroup.countrySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected states
     */
    if (upstreamFilterGroup.locationFilterGroup.regionSelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_STATE}
        IN (${ upstreamFilterGroup.locationFilterGroup.regionSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected cities
     */
    if (upstreamFilterGroup.locationFilterGroup.citySelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.UPSTREAM.columns.MFG_CITY}
        IN (${ upstreamFilterGroup.locationFilterGroup.citySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get lead time subquery
     */
    conditions.push(
      this.getLeadTimeSubquery(
        FilterFormService.environmentRouteTable.UPSTREAM.columns.LEAD_TIME,
        upstreamFilterGroup.additionalFilterGroup.minLeadTimeInput,
        upstreamFilterGroup.additionalFilterGroup.maxLeadTimeInput
      )
    );

    return conditions;
  }

  /**
   * Convert the downstream filter form group
   * @param downstreamFilterGroup The child form group.
   * Must be of type @var FormStructure.downstreamFilterGroup
   */
  private getDownstreamFormSubquery(downstreamFilterGroup): string[] {
    const conditions = [];

    /**
     * Get the selected countries
     */
    if (downstreamFilterGroup.locationFilterGroup.countrySelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_COUNTRY}
        IN (${ downstreamFilterGroup.locationFilterGroup.countrySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected states
     */
    if (downstreamFilterGroup.locationFilterGroup.regionSelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_STATE}
        IN (${ downstreamFilterGroup.locationFilterGroup.regionSelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get the selected cities
     */
    if (downstreamFilterGroup.locationFilterGroup.citySelect != null) {
      conditions.push(
        `${FilterFormService.environmentRouteTable.DOWNSTREAM.columns.GDC_CITY}
        IN (${ downstreamFilterGroup.locationFilterGroup.citySelect.map((e: string) => `'${e}'`).join(', ')})`
      );
    }

    /**
     * Get lead time subquery
     */
    conditions.push(
      this.getLeadTimeSubquery(
        FilterFormService.environmentRouteTable.UPSTREAM.columns.LEAD_TIME,
        downstreamFilterGroup.additionalFilterGroup.minLeadTimeInput,
        downstreamFilterGroup.additionalFilterGroup.maxLeadTimeInput
      )
    );

    return conditions;
  }

  /**
   * Helper function to convert additional filters in each
   * child form group into a SQL condition
   * @param field The field name that is being referenced
   * @param min The minimum lead time set by user
   * @param max The maximum lead time set by user
   */
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
