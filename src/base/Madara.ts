import { Source } from ".";
import { Manga, Chapter, ChapterDetails, SearchRequest, PagedResults } from "../models";

export abstract class Madara extends Source {

    getMangaDetails(mangaId: string): Promise<Manga> {
        throw new Error("Method not implemented.");
    }
    getChapters(mangaId: string): Promise<Chapter[]> {
        throw new Error("Method not implemented.");
    }
    getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        throw new Error("Method not implemented.");
    }
    searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        throw new Error("Method not implemented.");
    }

}