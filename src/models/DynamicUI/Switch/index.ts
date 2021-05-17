import { FormRowTyped } from "../FormRow"

export interface Switch extends FormRowTyped<boolean> {
    label: string
}

declare global {
    function createSwitch(info: Switch): Switch
}