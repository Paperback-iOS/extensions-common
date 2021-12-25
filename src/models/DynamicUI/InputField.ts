import { FormRowTyped } from ".."

export interface InputField extends FormRowTyped<string> {
    placeholder: string
    label?: string
    maskInput: boolean
}

declare global {
    function createInputField(info: InputField): InputField
}