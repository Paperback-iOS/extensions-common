import { MangaTile, IconText } from "."

const _global = global as any
_global.createMangaTile = function (mangaTile: MangaTile): MangaTile {
    return mangaTile
}

_global.createIconText = function (iconText: IconText): IconText {
    return iconText
}