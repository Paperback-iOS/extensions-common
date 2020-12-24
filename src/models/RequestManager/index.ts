import { Request } from "../RequestObject"
import { Response } from "../ResponseObject"

export interface RequestManagerInfo {
    requestsPerSecond: number
    requestTimeout?: number
}

export interface RequestManager extends RequestManagerInfo {
    schedule: (request: Request, retryCount: number) => Promise<Response>
}

declare global {
    function createRequestManager(info: RequestManagerInfo): RequestManager 
}
