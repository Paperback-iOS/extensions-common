import { OAuthButton } from "."

let _global = global as any

_global.createOAuthButton = function(info: OAuthButton): OAuthButton {
    return info
}