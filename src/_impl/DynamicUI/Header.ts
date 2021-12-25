import { Header } from ".."

let _global = global as any

_global.createHeader = function(info: Header): Header {
    return info
}