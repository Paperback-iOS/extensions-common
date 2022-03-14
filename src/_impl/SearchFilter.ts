import { SearchFilter, SortOption } from ".."

let _global = global as any

_global.createSearchFilter = function (info: Omit<SortOption, 'value'>[]): SearchFilter {
    return { sortOptions: info }
}
