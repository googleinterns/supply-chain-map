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
