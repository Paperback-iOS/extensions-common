import { Chapter, ChapterDetails, HomeSection, Manga, MangaUpdates, PagedResults, SearchRequest, Source, TagSection } from ".";

export class APIWrapper {

    async getMangaDetails(source: Source, mangaId: string): Promise<Manga> {
        return source.getMangaDetails(mangaId)
    }

    async getChapters(source: Source, mangaId: string): Promise<Chapter[]> {
        return source.getChapters(mangaId)
    }

    async getChapterDetails(source: Source, mangaId: string): Promise<ChapterDetails> {
        return source.getChapterDetails(mangaId)
    }

    async searchRequest(source: Source, query: SearchRequest, metadata?: any ): Promise<PagedResults> {
        return source.searchRequest(query, metadata)
    }

    async getTags(source: Source): Promise<TagSection[] | null> {
        return source.getTags()
    }

    async filterUpdatedManga(source: Source, time: Date): Promise<MangaUpdates[]> {
        // This method uses a callback to get multiple batches of updated manga. Aggrigate the data here
        // and return it all at once as a response

        var updateList: MangaUpdates[] = []
        let callbackFunc = function(updates: MangaUpdates) {
            updateList.push(updates)
        }

        Promise.all([source.filterUpdatedManga(callbackFunc, time)])

        return updateList
    }

    async getHomePageSections(source: Source): Promise<HomeSection[]> {
        // This method uses a callback to get multiple batches of a homesection. Aggrigate data and return all at once
        var sections: HomeSection[] = [];
        
        let callbackFunc = function(section: HomeSection) {
            sections.push(section)
        }

        Promise.all([source.getHomePageSections(callbackFunc)])

        return sections

    }

    async getViewMoreItems(source: Source, homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
        return source.getViewMoreItems(homepageSectionId, metadata)
    }

    async getWebsiteMangaDirectory(source: Source, metadata: any): Promise<PagedResults | null> {
        return source.getWebsiteMangaDirectory(metadata)
    }

}