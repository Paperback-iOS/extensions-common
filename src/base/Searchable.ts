import { PagedResults, SearchField, SearchRequest, TagSection, SearchFilter } from ".."
import { SortOption } from "../models"
import { Requestable } from "./Requestable"

export interface Searchable extends Requestable {
    getSearchResults(query: SearchRequest, metadata: unknown | undefined, sortOption: SortOption | undefined): Promise<PagedResults>
    
    getSearchFilter?(query: SearchRequest): Promise<SearchFilter>
    getSearchTags?(): Promise<TagSection[]>
    getSearchFields?(): Promise<SearchField[]>
    
    supportsTagExclusion?(): Promise<boolean>
    supportsSearchOperators?(): Promise<boolean>
}