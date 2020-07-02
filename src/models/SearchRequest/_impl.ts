import { SearchRequest } from "."

const _global = global as any

_global.createSearchRequest = function (searchRequest: SearchRequest): SearchRequest {
    return searchRequest
}