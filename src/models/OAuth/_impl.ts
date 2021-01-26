import { OAuth } from "."

const _global = global as any

_global.createPagedResults = function (update: OAuth): OAuth {
    return update
}

_global.isOAuthTokenExpired = function (token: OAuth): boolean {
    return (new Date().getMilliseconds() / 1000) > (token.createdAt + token.expiresIn - 3600)
}