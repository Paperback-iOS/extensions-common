import { HomeSection, HomeSectionRequest } from "./HomeSection"

const _global = global as any

_global.createHomeSection = function (section: HomeSection): HomeSection {
    return section
}

_global.createHomeSectionRequest = function (homeRequestObject: HomeSectionRequest): HomeSectionRequest {
    return homeRequestObject
}