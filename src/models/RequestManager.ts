import { Request, Response, RequestInterceptor, Cookie } from ".."

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
    cookieStore: {
        getAllCookies: () => Cookie[]
    }
}

declare global {
    function createRequestManager(info: RequestManagerInfo): RequestManager 
}
