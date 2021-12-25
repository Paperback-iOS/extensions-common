import { FormRowTyped } from ".."

export interface Label extends FormRowTyped<string | undefined> {
    label: string
}

declare global {
    function createLabel(info: Label): Label
}