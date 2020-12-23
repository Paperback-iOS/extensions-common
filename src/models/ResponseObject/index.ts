export interface Response {

    /**
     * The response which was provided from the server
     */
    data: any

    /**
     * The HTTP status code from the server response
     */
    status: number

    /**
     * The HTTP status message from the server response
     */
    statusText: string

    /**
     * The HTTP headers that the server responded with
     * All header names are lower cased and can be accessed
     * using the bracket notation.
     * Example: response.headers['content-type']
     */
    headers: any

    /**
     * The configuration which was provided to axios for the request.
     */
    config: any

    /**
     * The request which generated this response.
     */
    request: any
}

declare global {
    function createResponseObject(responseObject: Response): Response
}