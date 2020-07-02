import { SearchRequest } from "./SearchRequest"

const _global = global as any

_global.createSearchRequest = function (searchRequest: SearchRequest): SearchRequest {
    return searchRequest
}