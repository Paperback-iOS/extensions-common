import { FormRowTyped } from "../FormRow"

export interface Link extends FormRowTyped<string> {
    label: string
}

declare global {
    function createLink(info: Link): Link
}