import { RequestManager, RequestManagerInfo } from "."
import { Request } from "../RequestObject"

const _global = global as any

_global.createRequestManager = function (info: RequestManagerInfo): RequestManager {
    const axios = require('axios')
    
    return {
        ...info,
        schedule: async function (request: Request, retryCount: number) {
            // Append any cookies into the header properly
            let headers: any = request.headers ?? {}

            let cookieData = ''
            for (let cookie of request.cookies ?? [])
                cookieData += `${cookie.name}=${cookie.value};`

            headers['cookie'] = cookieData

            // If no user agent has been supplied, default to a basic Paperback-iOS agent
            headers['user-agent'] = headers["user-agent"] ?? 'Paperback-iOS'

            // If we are using a urlencoded form data as a post body, we need to decode the request for Axios
            let decodedData = request.data
            if(headers['content-type']?.includes('application/x-www-form-urlencoded')) {
                decodedData = ""
                for(let attribute in request.data) {
                    if(decodedData) {
                        decodedData += "&"
                    }
                    decodedData += `${attribute}=${request.data[attribute]}`
                }
            }

            // We must first get the response object from Axios, and then transcribe it into our own Response type before returning
            let response = await axios({
                url: `${request.url}${request.param ?? ''}`,
                method: request.method,
                headers: headers,
                data: decodedData,
                timeout: info.requestTimeout || 0
            })

            return Promise.resolve(createResponseObject({
                data: response.data,
                status: response.status,
                headers: response.headers,
                request: request
            }))
        }
    }
}