import { ChapterDetails } from "./ChapterDetails"

const _global = global as any

_global.createChapterDetails = function (chapterDetails: ChapterDetails): ChapterDetails {
    return chapterDetails
}