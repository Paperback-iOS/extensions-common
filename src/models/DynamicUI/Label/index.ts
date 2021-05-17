import { FormRowTyped } from "../FormRow"

export interface Label extends FormRowTyped<string> {
    label: string
}

declare global {
    function createLabel(info: Label): Label
}