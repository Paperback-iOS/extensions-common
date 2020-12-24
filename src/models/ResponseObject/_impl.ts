import {Response} from '.'

const _global = global as any

_global.createResponseObject = function(responseObject: Response): Response {
    return responseObject
}