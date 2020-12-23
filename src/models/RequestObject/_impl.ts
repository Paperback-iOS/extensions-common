import { Request, Cookie } from '.'
import {Response} from '../ResponseObject'

const axios = require('axios')

const _global = global as any

_global.createCookie = function (cookie: Cookie): Cookie {
    return cookie
}

_global.createRequestObject = function (requestObject: Request): {request: Request, perform: () => Promise<Response>} {
    return {
        request: requestObject,
        perform: async function() {

            // Append any cookies into the header properly
            let headers: any = requestObject.headers == undefined ? {} : requestObject.headers

            let cookieData = ''
            for(let cookie of requestObject.cookies ?? [])
                cookieData += `${cookie.name}=${cookie.value};`
            
            headers['Cookie'] = cookieData

            // If no user agent has been supplied, default to a basic Paperback-iOS agent
            headers['User-Agent'] = `${requestObject.useragent ?? 'Paperback-iOS'}`

            // We must first get the response object from Axios, and then transcribe it into our own Response type before returning
            let response = await axios({
                url: `${requestObject.url}${requestObject.param ?? ''}`,
                method: requestObject.method,
                headers: headers,
                data: requestObject.data,
                timeout: requestObject.timeout || 0
            })

            return Promise.resolve(createResponseObject({
               data: response.data,
               status: response.status,
               statusText: response.statusText,
               headers: response.headers,
               config: response.config,
               request: response.request
            }))
        }
    }
}
