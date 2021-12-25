import { Label } from ".."

let _global = global as any

_global.createLabel = function(info: Label): Label {
    return info
}