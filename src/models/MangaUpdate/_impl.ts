import { MangaUpdates } from "."

const _global = global as any

_global.createMangaUpdates = function (update: MangaUpdates): MangaUpdates {
    return update
}