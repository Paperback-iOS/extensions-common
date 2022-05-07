import { RequestManager, RequestManagerInfo } from "."
import { Request, Cookie } from "../RequestObject"
import { Response } from "../ResponseObject"
import axios, { Method } from 'axios'
import { CookieJar } from 'tough-cookie';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';

const _global = global as any

_global.createRequestManager = function (info: RequestManagerInfo): RequestManager {
    const jar = new CookieJar();
    let cookies: Cookie[] = []
    return {
        ...info,
        schedule: async function (request: Request, retryCount: number) {

            // Pass this request through the interceptor if one exists
            if(info.interceptor) {
                request = await info.interceptor.interceptRequest(request)
            }

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
            if(typeof decodedData == 'object') {
                if(headers['content-type']?.includes('application/x-www-form-urlencoded')) {
                    decodedData = ""
                    Object.keys(request.data).forEach(attribute => {
                        if(decodedData.length > 0) {
                            decodedData += "&"
                        }
                        decodedData += `${attribute}=${request.data[attribute]}`
                    })
                }
            }

            // We must first get the response object from Axios, and then transcribe it into our own Response type before returning
            let response = await axios(`${request.url}${request.param ?? ''}`, {
                method: <Method> request.method,
                headers: headers,
                data: decodedData,
                timeout: info.requestTimeout || 0,
                responseType: 'arraybuffer',
                httpAgent: new HttpCookieAgent({ jar }),
                httpsAgent: new HttpsCookieAgent({ jar }),
            })

            let responsePacked: Response = {
                rawData: createRawData(response.data),
                data: Buffer.from(response.data, 'binary').toString(),
                status: response.status,
                headers: response.headers,
                request: request
            }

            cookies = (await jar.getCookies(request.url)).map(cookie => ({
                name: cookie.key,
                value: cookie.value,
                domain: cookie.domain || new URL(request.url).host,
                path: cookie.path || undefined,
                created: cookie.creation || undefined,
                expires: cookie.expires instanceof Date ? cookie.expires : undefined
            }))

            // Pass this through the response interceptor if one exists
            if(info.interceptor) {
                responsePacked = await info.interceptor.interceptResponse(responsePacked)
            }

            return responsePacked
        },
        cookieStore: {
            getAllCookies: function (): Cookie[] {
                return cookies
            }
        }
    }
}