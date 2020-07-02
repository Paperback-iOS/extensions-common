import { HomeSection, HomeSectionRequest } from "."

const _global = global as any

_global.createHomeSection = function (section: HomeSection): HomeSection {
    return section
}

_global.createHomeSectionRequest = function (homeRequestObject: HomeSectionRequest): HomeSectionRequest {
    return homeRequestObject
}