import { Request } from "../RequestObject"
import { Response } from "../ResponseObject"

export abstract class RequestInterceptor {
    /**
     * This method is invoked asynchronously
     * @param request The intercepted request
     */
    abstract interceptRequest(request: Request): Promise<Request>

    /**
     * While this method can be marked async, you should not
     * do any long running/blocking tasks here. The underlying swift
     * implementation does not run asynchronously and blocks the 
     * thread it was invoked on
     * 
     * You *cannot* modify anything other than the data in a Response
     * @param response The intercepted response
     */
    abstract interceptResponse(response: Response): Promise<Response>
}