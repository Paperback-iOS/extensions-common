import { FormRowTyped } from ".."

export interface Select extends FormRowTyped<string[]> {
    label: string
    options: string[]

    allowsMultiselect?: boolean
    /// If multiselect is allowed, specify the minimum number of selected items required
    minimumOptionCount?: number

    /// Returns the label for the given option
    displayLabel: (option: string) => string
}

declare global {
    function createSelect(info: Select): Select
}