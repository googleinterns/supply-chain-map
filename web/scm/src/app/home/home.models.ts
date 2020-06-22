/**
 * The return type expected after running the query
 * obtained from side panel form.
 */
export interface FormQueryResponse {
    formQueryResult: FormQueryResult;
    formQueryResultSchema: FormQueryResultSchema;
    formQueryResultStats: FormQueryResultStats;
}

export interface FormQueryResult {
    upstream: FormQueryUpstreamResult[];
    cm: FormQueryCmResult[];
    downstream: FormQueryDownstreamResult[];
}

export interface FormQueryUpstreamResult {
    product: string;
    parent_sku: string;
    part_number: string;
    description: string;
    category: string;
    supplier_name: string;
    lead_time: string;
    mfg_city: string;
    mfg_state: string;
    mfg_country: string;
    mfg_lat: number;
    mfg_long: number;
}

export interface FormQueryCmResult {
    product: string;
    sku: string;
    description: string;
    cm_name: string;
    lead_time: string;
    cm_city: string;
    cm_state: string;
    cm_country: string;
    cm_lat: number;
    cm_long: number;
}

export interface FormQueryDownstreamResult {
    product: string;
    sku: string;
    gdc_code: string;
    lead_time: string;
    gdc_city: string;
    gdc_state: string;
    gdc_country: string;
    gdc_lat: number;
    gdc_long: number;
}

export interface FormQueryResultSchema {
    upstream: {
        fields: {
            name: string,
            type: string,
            mode: string
        }[]
    };
    cm: {
        fields: {
            name: string,
            type: string,
            mode: string
        }[]
    };
    downstream: {
        fields: {
            name: string,
            type: string,
            mode: string
        }[]
    };
}

export interface FormQueryResultStats {
    jobId: string;
    projectId: string;
    jobComplete: boolean;
    cacheHit: boolean;
    totalBytesProcessed: string;
}
