import {Request} from '..'

export interface MangaUpdates {
    ids: string[]
}

declare global {
    function createMangaUpdates(update: MangaUpdates): MangaUpdates
}