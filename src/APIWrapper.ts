import { Chapter, ChapterDetails, HomeSection, Manga, MangaTile, MangaUpdates, PagedResults, SearchRequest, Source, TagSection } from ".";
import "./models/impl_export"

export class APIWrapper {

    async getMangaDetails(source: Source, mangaId: string): Promise<Manga> {
        return source.getMangaDetails(mangaId)
    }

    async getChapters(source: Source, mangaId: string): Promise<Chapter[]> {
        return source.getChapters(mangaId)
    }

    async getChapterDetails(source: Source, mangaId: string, chapterId: string): Promise<ChapterDetails> {
        return source.getChapterDetails(mangaId, chapterId)
    }

    async searchRequest(source: Source, query: SearchRequest, metadata?: any ): Promise<PagedResults> {
        return source.searchRequest(query, metadata)
    }

    async getTags(source: Source): Promise<TagSection[] | null> {
        return source.getTags()
    }

    async filterUpdatedManga(source: Source, time: Date, ids: string[]): Promise<MangaUpdates[]> {
        // This method uses a callback to get multiple batches of updated manga. Aggrigate the data here
        // and return it all at once as a response

        var updateList: MangaUpdates[] = []
        let callbackFunc = function(updates: MangaUpdates) {
            updateList.push(updates)
        }

        await source.filterUpdatedManga(callbackFunc, time, ids)

        return updateList
    }

    async getHomePageSections(source: Source): Promise<HomeSection[]> {
        // This method uses a callback to get multiple batches of a homesection. Aggrigate data and return all at once
        var sections: HomeSection[] = [];
        
        let callbackFunc = function(section: HomeSection) {
            sections.push(section)
        }

        await source.getHomePageSections(callbackFunc)

        return sections
    }

    /**
     * Performs a 'get more' request. Usually this is done when a homesection has it's 'View More' button tapped, and the user 
     * is starting to scroll through all of the available titles in each section. 
     * It is recommended that when you write your tests for a source, that you run one test using this function,
     * for each homepageSectionId that the source offers, if those sections are expected to traverse multiple pages
     * @param source 
     * @param homepageSectionId 
     * @param metadata 
     * @param resultPageLimiter How many pages this should attempt to iterate through at most. This prevents
     * you from being in an infinite loop. Defaults to 3.
     */
    async getViewMoreItems(source: Source, homepageSectionId: string, metadata: any, resultPageLimiter: number = 3): Promise<MangaTile[] | null> {
        var results: MangaTile[] = []
        
        // This may (and likely will) run multiple times, for multiple pages. Aggrigate up to the page limiter
        for(let i = 0; i < resultPageLimiter; i++) {

            let sourceResults: PagedResults | null = await source.getViewMoreItems(homepageSectionId, metadata)

            if(sourceResults === null || sourceResults.results.length == 0) {
                console.error(`getViewMoreItems was asked to run to a maximum of ${resultPageLimiter} pages, but retrieved no results on page ${i}`)
                return results
            }

            results = results.concat(sourceResults.results)
            metadata = sourceResults.metadata

            // If there is no other pages available, meaning the metadata is empty, exit the loop and do not try again
            if(!sourceResults.metadata) {
                break
            }            
        }

        return results
    }

    async getWebsiteMangaDirectory(source: Source, metadata: any): Promise<PagedResults | null> {
        return source.getWebsiteMangaDirectory(metadata)
    }

}