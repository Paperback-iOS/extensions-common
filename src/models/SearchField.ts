
export interface SearchField {
    id: string
    placeholder: string
    name: string
}

declare global {
    function createSearchField(info: SearchField): SearchField
}