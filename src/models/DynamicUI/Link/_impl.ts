import { Link } from "."

let _global = global as any

_global.createLink = function(info: Link): Link {
    return info
}