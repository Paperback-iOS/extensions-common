export interface SourceMenu {
    items: SourceMenuItem[]
}

export interface SourceMenuItem {
    id: string
    label: string
    type: SourceMenuItemType
}

export enum SourceMenuItemType {
    LINK = 'link',
    FORM = 'form'
}

declare global {
    function createSourceMenu(menu: SourceMenu): SourceMenu
    function createSourceMenuItem(item: SourceMenuItem): SourceMenuItem
}