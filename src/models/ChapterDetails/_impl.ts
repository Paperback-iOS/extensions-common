import { ChapterDetails } from "."

const _global = global as any

_global.createChapterDetails = function (chapterDetails: ChapterDetails): ChapterDetails {
    return chapterDetails
}