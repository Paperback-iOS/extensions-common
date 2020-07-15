import { MangaUpdates } from "./MangaUpdate"

const _global = global as any

_global.createMangaUpdates = function (update: MangaUpdates): MangaUpdates {
    return update
}