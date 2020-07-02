import { Manga } from "."

const _global = global as any

_global.createManga = function (manga: Manga): Manga {
    return manga
}