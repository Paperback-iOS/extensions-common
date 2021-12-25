import { TrackedMangaChapterReadAction } from ".."

export interface TrackerActionQueue {
    queuedChapterReadActions(): Promise<TrackedMangaChapterReadAction[]>
    
    retryChapterReadAction(chapterReadAction: TrackedMangaChapterReadAction): Promise<void>
    discardChapterReadAction(chapterReadACtion: TrackedMangaChapterReadAction): Promise<void>

    retryAllChapterReadAction(): Promise<void>
    discardAllChapterReadAction(): Promise<void>
}