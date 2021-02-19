import { SourceMenuItem, SourceMenuItemType, SourceMenu } from "."

const _global = global as any

_global.createSourceItem = function(item: SourceMenuItem): SourceMenuItem {
    return item
}

_global.createSourceMenu = function(menu: SourceMenu): SourceMenu {
    return menu
}