import { Chapter } from "./Chapter"

const _global = global as any

_global.createChapter = function (chapter: Chapter): Chapter {
    return chapter
}