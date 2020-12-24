import { MangaTile } from "..";
import { Request } from "..";

export interface PagedResults {
    results: MangaTile[]
    metadata?: any
}

declare global {
    function createPagedResults(update: PagedResults): PagedResults
}