import {Request} from '..'

export interface MangaUpdates {
    ids: string[]
    nextPage?: Request
}

declare global {
    function createMangaUpdates(update: MangaUpdates): MangaUpdates
}