export interface MangaUpdates {
    ids: string[]
    moreResults?: boolean
}

declare global {
    function createMangaUpdates(update: MangaUpdates): MangaUpdates
}