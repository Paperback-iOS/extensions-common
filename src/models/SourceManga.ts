import { Manga } from ".."

export interface SourceManga {
    id: string
    mangaInfo: Manga
}

declare global {
    function createSourceManga(info: SourceManga): SourceManga
}