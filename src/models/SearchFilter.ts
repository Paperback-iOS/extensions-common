export interface SearchFilter {
    sortOptions: Omit<SortOption, 'value'>[]
}

export interface SortOption {
    id: string
    name: string
    value: true | 'ASC' | 'DESC'
    type: 'TOGGLE' | 'ORDERED'
}

declare global {
    function createSearchFilter(sortOptions: Omit<SortOption, 'value'>[]): SearchFilter
}