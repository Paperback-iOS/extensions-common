import { PagedResults } from "."

const _global = global as any

_global.createPagedResults = function (update: PagedResults): PagedResults {
    return update
}