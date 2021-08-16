import { Select } from "."

let _global = global as any

_global.createSelect = function(info: Select): Select {
    return info
}