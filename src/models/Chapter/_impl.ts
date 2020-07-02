import { Chapter } from "."

const _global = global as any

_global.createChapter = function (chapter: Chapter): Chapter {
    return chapter
}