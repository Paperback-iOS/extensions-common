import { Manga } from ".."

export interface TrackedManga {
    id: string
    mangaInfo: Manga
}

declare global {
    function createTrackedManga(info: TrackedManga): TrackedManga
}