import { Form, PagedResults, RequestManager, SearchRequest } from ".."
import { TrackedManga } from "../models/TrackedManga"

export abstract class Tracker {
    /**
     * Manages the ratelimits and the number of requests that can be done per second
     * This is also used to fetch pages when a chapter is downloading
     */
    abstract readonly requestManager: RequestManager
    constructor(protected cheerio: CheerioAPI) {}

    abstract getSearchResults(query: SearchRequest): Promise<PagedResults>
    abstract getMangaForm(mangaId: string): Promise<Form>
    abstract getTrackedManga(mangaId: string): Promise<TrackedManga>
}