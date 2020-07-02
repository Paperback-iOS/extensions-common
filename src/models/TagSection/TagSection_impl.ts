import { TagSection, Tag } from './TagSection'

const _global = global as any

_global.createTagSection = function (tagSection: TagSection): TagSection {
    return tagSection
}

_global.createTag = function (tag: Tag): Tag {
    return tag
}