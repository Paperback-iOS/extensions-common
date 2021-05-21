import { Form } from "../Form"
import { FormRowTyped } from "../FormRow"

export interface NavigationButton extends FormRowTyped<string | undefined> {
    label: string
    form: Form
}

declare global {
    function createNavigationButton(info: NavigationButton): NavigationButton
}