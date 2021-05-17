import { FormRowTyped } from "../FormRow"
import { Label } from "../Label"

export interface Select extends FormRowTyped<string> {
    label: string
    options: Label[]
}

declare global {
    function createSelect(info: Select): Select
}