import { TrackedManga } from ".."

let _global = global as any

_global.createTrackedManga = function(info: TrackedManga): TrackedManga {
    return info
}