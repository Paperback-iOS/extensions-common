import { MangaTile } from "..";
import { Request } from "..";

export interface PagedResults {
    results: MangaTile[]
    nextPage?: Request
}

declare global {
    function createPagedResults(update: PagedResults): PagedResults
}