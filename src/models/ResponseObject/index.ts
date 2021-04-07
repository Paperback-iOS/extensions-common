import { RawData } from "../RawData"
import { Request } from "../RequestObject"

export interface Response {
    rawData: RawData

    /**
     * The response which was provided from the server
     */
    data: string

    /**
     * The HTTP status code from the server response
     */
    status: number

    /**
     * The HTTP headers that the server responded with
     * All header names are lower cased and can be accessed
     * using the bracket notation.
     * Example: response.headers['content-type']
     */
    headers: any

    /**
     * The request which generated this response.
     */
    request: Request
}