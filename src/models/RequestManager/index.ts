import { Request } from "../RequestObject"
import { Response } from "../ResponseObject"

export interface RequestManagerInfo {
    requestsPerSecond: number
    
    /**
     * The time (in milliseconds) before a request is retried or dropped
     */
    requestTimeout?: number
}

export interface RequestManager extends RequestManagerInfo {
    schedule: (request: Request, retryCount: number) => Promise<Response>
}

declare global {
    function createRequestManager(info: RequestManagerInfo): RequestManager 
}
