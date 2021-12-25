import { Request, Response, RequestInterceptor } from ".."

export interface RequestManagerInfo {
    requestsPerSecond: number
    
    /**
     * The time (in milliseconds) before a request is retried or dropped
     */
    requestTimeout?: number

    interceptor?: RequestInterceptor
}

export interface RequestManager extends RequestManagerInfo {
    schedule: (request: Request, retryCount: number) => Promise<Response>
}

declare global {
    function createRequestManager(info: RequestManagerInfo): RequestManager 
}
