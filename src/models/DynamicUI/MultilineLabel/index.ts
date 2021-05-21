import { FormRowTyped } from "../FormRow"

export interface MultilineLabel extends FormRowTyped<string> {
    label: string
}

declare global {
    function createMultilineLabel(info: MultilineLabel): MultilineLabel
}