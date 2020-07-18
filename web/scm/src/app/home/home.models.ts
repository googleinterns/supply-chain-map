/**
 * The return type expected after running the query
 * obtained from side panel form.
 */
export interface FormQueryResponse {
    formQueryResult: FormQueryResult;
    formQueryResultStats: FormQueryResultStats;
}

export interface FormQueryResult {
    upstream?: object[];
    cm: object[];
    downstream?: object[];
}

export interface FormQueryResultStats {
    jobId: string;
    projectId: string;
    jobComplete: boolean;
    cacheHit: boolean;
    totalBytesProcessed: string;
}
