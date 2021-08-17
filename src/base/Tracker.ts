import { Form, PagedResults, RequestManager, SearchRequest } from ".."
import { Section, TrackerActionQueue } from "../models"
import { TrackedManga } from "../models/TrackedManga"
import { Requestable } from "./Requestable"
import { Searchable } from "./Searchable"

export abstract class Tracker implements Requestable, Searchable {
    /**
     * Manages the ratelimits and the number of requests that can be done per second
     * This is also used to fetch pages when a chapter is downloading
     */
    abstract readonly requestManager: RequestManager
    constructor(protected cheerio: CheerioAPI) {}

    abstract getSearchResults(query: SearchRequest, metadata: unknown): Promise<PagedResults>

    /// This cannot be async since the app expects a form as soon as this function is called
    /// for async tasks handle them in `sections`.
    abstract getMangaForm(mangaId: string): Form

    abstract getTrackedManga(mangaId: string): Promise<TrackedManga>
    abstract getSourceMenu(): Promise<Section>

    /// This method MUST dequeue all actions and process them, any unsuccessful actions
    /// must be marked for retry instead of being left in the queue.
    /// NOTE: Retried actions older than 24 hours will be discarded
    abstract processActionQueue(actionQueue: TrackerActionQueue): Promise<void>
}