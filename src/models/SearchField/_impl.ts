import { SearchField } from "."

let _global = global as any

_global.createSearchField = function(info: SearchField): SearchField {
    return info
}