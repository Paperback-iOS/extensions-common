import { FormRowTyped } from ".."

export interface Link extends FormRowTyped<string | undefined> {
    label: string
}

declare global {
    function createLink(info: Link): Link
}