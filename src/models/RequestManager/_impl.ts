import { RequestManager, RequestManagerInfo } from "."
import { Request } from "../RequestObject"

const _global = global as any

_global.createRequestManager = function (info: RequestManagerInfo): RequestManager {
    const axios = require('axios')
    
    return {
        ...info,
        schedule: async function (request: Request, retryCount: number) {
            // Append any cookies into the header properly
            let headers: any = request.headers == undefined ? {} : request.headers

            let cookieData = ''
            for (let cookie of request.cookies ?? [])
                cookieData += `${cookie.name}=${cookie.value};`

            headers['Cookie'] = cookieData

            // If no user agent has been supplied, default to a basic Paperback-iOS agent
            headers['User-Agent'] = `${request.useragent ?? 'Paperback-iOS'}`

            // We must first get the response object from Axios, and then transcribe it into our own Response type before returning
            let response = await axios({
                url: `${request.url}${request.param ?? ''}`,
                method: request.method,
                headers: headers,
                data: request.data,
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