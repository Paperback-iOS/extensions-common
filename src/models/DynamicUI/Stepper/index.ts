import { FormRowTyped } from "../FormRow"

export interface Stepper extends FormRowTyped<number> {
    label: string
    min?: number
    max?: number
    step?: number
}

declare global {
    function createStepper(info: Stepper): Stepper
}