import { SourceManga } from ".."

let _global = global as any

_global.createSourceManga = function(info: SourceManga): SourceManga {
    return info
}