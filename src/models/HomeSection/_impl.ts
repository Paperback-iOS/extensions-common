import { HomeSection } from "."

const _global = global as any

_global.createHomeSection = function (section: HomeSection): HomeSection {
    return section
}