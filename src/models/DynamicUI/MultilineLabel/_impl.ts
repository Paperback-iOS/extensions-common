import { MultilineLabel } from "."

let _global = global as any

_global.createMultilineLabel = function(info: MultilineLabel): MultilineLabel {
    return info
}